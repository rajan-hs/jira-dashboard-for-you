import React, { useState, useMemo } from 'react';
import TaskRow from './TaskRow.jsx';

const COLUMNS = [
  { key: '#', label: '#', className: 'th-count', sortable: false },
  { key: 'key', label: 'Key', className: 'th-key', sortable: true },
  { key: 'summary', label: 'Summary', className: 'th-summary', sortable: true },
  { key: 'status', label: 'Status', className: 'th-status', sortable: true },
  { key: 'priority', label: 'Priority', className: 'th-priority', sortable: true },
  { key: 'type', label: 'Type', className: 'th-type', sortable: true },
  { key: 'updated', label: 'Updated', className: 'th-updated', sortable: true },
];

function getSortValue(issue, columnKey) {
  const { key, fields } = issue;
  switch (columnKey) {
    case 'key': return key;
    case 'summary': return (fields.summary || '').toLowerCase();
    case 'status': return (fields.status?.name || '').toLowerCase();
    case 'priority': return Number(fields.priority?.id) || 999;
    case 'type': return (fields.issuetype?.name || '').toLowerCase();
    case 'updated': return fields.updated || '';
    default: return '';
  }
}

export default function Dashboard({ issues, siteUrl }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedIssues = useMemo(() => {
    if (!Array.isArray(issues)) return [];
    if (!sortColumn) return issues;
    const sorted = [...issues].sort((a, b) => {
      const aVal = getSortValue(a, sortColumn);
      const bVal = getSortValue(b, sortColumn);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
      }
      return String(aVal).localeCompare(String(bVal));
    });
    if (sortDirection === 'desc') sorted.reverse();
    return sorted;
  }, [issues, sortColumn, sortDirection]);

  return (
    <div className="dashboard">
      <table className="task-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`${col.className}${col.sortable ? ' th-sortable' : ''}`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                {col.label}
                {col.sortable && (
                  <span className="sort-indicator">
                    {sortColumn === col.key ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedIssues.map((issue, index) => (
            <TaskRow key={issue.id} issue={issue} siteUrl={siteUrl} rowNum={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
