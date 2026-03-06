const storage = typeof chrome !== 'undefined' && chrome.storage
  ? chrome.storage.sync
  : null;

export async function getSettings() {
  if (!storage) {
    return JSON.parse(localStorage.getItem('jira-settings') || '{}');
  }
  return new Promise((resolve) => {
    storage.get(['siteUrl', 'email', 'apiToken'], resolve);
  });
}

export async function saveSettings({ siteUrl, email, apiToken }) {
  const data = { siteUrl, email, apiToken };
  if (!storage) {
    localStorage.setItem('jira-settings', JSON.stringify(data));
    return;
  }
  return new Promise((resolve) => {
    storage.set(data, resolve);
  });
}

export async function clearSettings() {
  if (!storage) {
    localStorage.removeItem('jira-settings');
    return;
  }
  return new Promise((resolve) => {
    storage.remove(['siteUrl', 'email', 'apiToken'], resolve);
  });
}

export async function getPreferences() {
  if (!storage) {
    return JSON.parse(localStorage.getItem('jira-prefs') || '{}');
  }
  return new Promise((resolve) => {
    storage.get(['darkMode', 'hiddenStatuses', 'autoRedirect'], resolve);
  });
}

export async function savePreferences({ darkMode, hiddenStatuses, autoRedirect }) {
  const data = { darkMode, hiddenStatuses, autoRedirect };
  if (!storage) {
    localStorage.setItem('jira-prefs', JSON.stringify(data));
    return;
  }
  return new Promise((resolve) => {
    storage.set(data, resolve);
  });
}
