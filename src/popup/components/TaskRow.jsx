import React from 'react';
import Lozenge from '@atlaskit/lozenge';
import { getStatusAppearance, getPriorityAppearance } from '../../utils/constants.js';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TaskRow({ issue, siteUrl }) {
  const { key, fields } = issue;
  const statusName = fields.status?.name || 'Unknown';
  const priorityName = fields.priority?.name || 'None';
  const typeName = fields.issuetype?.name || 'Task';
  const typeIcon = fields.issuetype?.iconUrl;

  const statusAppearance = getStatusAppearance(fields.status?.statusCategory);
  const priorityAppearance = getPriorityAppearance(fields.priority);

  const issueUrl = siteUrl ? `${siteUrl}/browse/${key}` : '#';

  return (
    <tr className="task-row">
      <td className="cell-key">
        <a href={issueUrl} target="_blank" rel="noopener noreferrer">
          {key}
        </a>
      </td>
      <td className="cell-summary">{fields.summary}</td>
      <td className="cell-status">
        <Lozenge appearance={statusAppearance} isBold>
          {statusName}
        </Lozenge>
      </td>
      <td className="cell-priority">
        <Lozenge appearance={priorityAppearance}>
          {priorityName}
        </Lozenge>
      </td>
      <td className="cell-type">
        {typeIcon && <img src={typeIcon} alt="" width="16" height="16" className="type-icon" />}
        {typeName}
      </td>
      <td className="cell-updated">{formatDate(fields.updated)}</td>
    </tr>
  );
}
