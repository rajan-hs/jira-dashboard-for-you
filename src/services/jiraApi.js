import { getSettings } from './storage.js';
import { JIRA_FIELDS, PAGE_SIZE } from '../utils/constants.js';
import { buildJql } from '../utils/jql.js';

function getAuthHeaders(email, apiToken) {
  const auth = btoa(`${email}:${apiToken}`);
  return {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

function normalizeSiteUrl(url) {
  let site = url.trim().replace(/\/+$/, '');
  if (!site.startsWith('https://')) {
    site = `https://${site}`;
  }
  return site;
}

export async function fetchMyTasks(filters = {}, page = 0) {
  const { siteUrl, email, apiToken } = await getSettings();
  if (!siteUrl || !email || !apiToken) {
    throw new Error('Jira credentials not configured. Open extension settings.');
  }

  const jql = buildJql(filters);
  const startAt = page * PAGE_SIZE;
  const baseUrl = normalizeSiteUrl(siteUrl);
  const params = new URLSearchParams({
    jql,
    fields: JIRA_FIELDS,
    startAt: String(startAt),
    maxResults: String(PAGE_SIZE),
  });

  const res = await fetch(`${baseUrl}/rest/api/3/search/jql?${params}`, {
    headers: getAuthHeaders(email, apiToken),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Authentication failed. Check your email and API token.');
    if (res.status === 403) throw new Error('Permission denied. Check your Jira access.');
    if (res.status === 429) throw new Error('Rate limited. Please wait a moment and try again.');
    throw new Error(`Jira API error: ${res.status}`);
  }

  const data = await res.json();
  return {
    issues: data.issues || [],
    total: data.total || 0,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function testConnection() {
  const { siteUrl, email, apiToken } = await getSettings();
  if (!siteUrl || !email || !apiToken) {
    throw new Error('Please fill in all fields.');
  }
  const baseUrl = normalizeSiteUrl(siteUrl);
  const res = await fetch(`${baseUrl}/rest/api/3/myself`, {
    headers: getAuthHeaders(email, apiToken),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Authentication failed. Check your credentials.');
    throw new Error(`Connection failed: ${res.status}`);
  }
  return res.json();
}
