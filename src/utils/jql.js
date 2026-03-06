export function buildJql({ searchText } = {}) {
  const clauses = ['assignee = currentUser()'];

  if (searchText) {
    clauses.push(`summary ~ "${searchText}"`);
  }

  return clauses.join(' AND ') + ' ORDER BY updated DESC';
}
