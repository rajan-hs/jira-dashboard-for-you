export function buildJql({ searchText, assigneeAccountId } = {}) {
  const assigneeClause = assigneeAccountId
    ? `assignee = "${assigneeAccountId}"`
    : 'assignee = currentUser()';
  const clauses = [assigneeClause];

  if (searchText) {
    clauses.push(`summary ~ "${searchText}"`);
  }

  return clauses.join(' AND ') + ' ORDER BY updated DESC';
}
