export const PAGE_SIZE = 100;

export const JIRA_FIELDS = [
  'summary',
  'status',
  'priority',
  'issuetype',
  'updated',
].join(',');

// Derive lozenge appearance from Jira's statusCategory.key
const STATUS_CATEGORY_MAP = {
  'done': 'success',
  'indeterminate': 'inprogress',
  'new': 'new',
};

export function getStatusAppearance(statusCategory) {
  const key = (statusCategory?.key || statusCategory?.name || '').toLowerCase();
  return STATUS_CATEGORY_MAP[key] || 'default';
}

// Derive priority appearance from its position in the list (Jira returns them ordered highest→lowest)
// We just use a simple heuristic based on the id — lower id = higher priority
export function getPriorityAppearance(priority) {
  if (!priority?.id) return 'default';
  const id = Number(priority.id);
  if (id <= 1) return 'removed';   // Highest / Blocker
  if (id <= 2) return 'moved';     // High
  if (id <= 3) return 'new';       // Medium
  return 'default';                // Low / Lowest
}
