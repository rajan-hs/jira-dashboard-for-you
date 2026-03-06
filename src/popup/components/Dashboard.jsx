import React, { useState, useMemo } from 'react';
import TaskRow from './TaskRow.jsx';

const COLUMNS = [
  { key: 'key', label: 'Key', className: 'th-key' },
  { key: 'summary', label: 'Summary', className: 'th-summary' },
  { key: 'status', label: 'Status', className: 'th-status' },
  { key: 'priority', label: 'Priority', className: 'th-priority' },
  { key: 'type', label: 'Type', className: 'th-type' },
  { key: 'updated', label: 'Updated', className: 'th-updated' },
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
                className={`${col.className} th-sortable`}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                <span className="sort-indicator">
                  {sortColumn === col.key ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedIssues.map((issue) => (
            <TaskRow key={issue.id} issue={issue} siteUrl={siteUrl} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
