import React, { useState, useEffect, useCallback } from 'react';
import Spinner from '@atlaskit/spinner';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import Dashboard from './components/Dashboard.jsx';
import Pagination from './components/Pagination.jsx';
import { fetchMyTasks, testConnection } from '../services/jiraApi.js';
import { getSettings, saveSettings, clearSettings, getPreferences, savePreferences } from '../services/storage.js';

function OnboardingForm({ onComplete }) {
  const [siteUrl, setSiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleTest = async () => {
    setTesting(true);
    setMessage(null);
    try {
      await saveSettings({ siteUrl, email, apiToken });
      const user = await testConnection();
      setMessage({
        type: 'success',
        text: `Connected! Logged in as ${user.displayName} (${user.emailAddress}).`,
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setTesting(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await saveSettings({ siteUrl, email, apiToken });
      onComplete();
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
      setSaving(false);
    }
  };

  const isValid = siteUrl.trim() && email.trim() && apiToken.trim();

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Welcome to Jira Dashboard</h1>
        <p className="onboarding-subtitle">Connect your Jira account to get started.</p>

        <div className="onboarding-field">
          <label className="onboarding-label">Jira Site URL</label>
          <input
            className="onboarding-input"
            type="text"
            placeholder="https://yoursite.atlassian.net"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
          />
          <p className="onboarding-hint">Your Atlassian Cloud site URL</p>
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">Email</label>
          <input
            className="onboarding-input"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">API Token</label>
          <input
            className="onboarding-input"
            type="password"
            placeholder="Your Jira API token"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
          />
          <p className="onboarding-hint">
            Generate a token at{' '}
            <a
              href="https://id.atlassian.com/manage-profile/security/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
            >
              Atlassian API Tokens
            </a>
          </p>
        </div>

        <div className="onboarding-actions">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!isValid || saving}
          >
            {saving ? 'Saving…' : 'Save & Continue'}
          </button>
          <button
            className="btn-secondary"
            onClick={handleTest}
            disabled={!isValid || testing}
          >
            {testing ? 'Testing…' : 'Test Connection'}
          </button>
        </div>

        {message && (
          <div className={`onboarding-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_HIDDEN = ['Done', 'Resolved', 'Archived', 'Closed'];

export default function App() {
  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [configured, setConfigured] = useState(true);
  const [siteUrl, setSiteUrl] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [hiddenStatuses, setHiddenStatuses] = useState(DEFAULT_HIDDEN);
  const [autoRedirect, setAutoRedirect] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const loadTasks = useCallback(async (currentFilters, currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyTasks(currentFilters, currentPage);
      setIssues(result.issues);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const initDashboard = useCallback(async () => {
    const settings = await getSettings();
    if (!settings.siteUrl || !settings.email || !settings.apiToken) {
      setConfigured(false);
      setLoading(false);
      return;
    }
    setConfigured(true);
    setSiteUrl(settings.siteUrl.trim().replace(/\/+$/, ''));

    const prefs = await getPreferences();
    if (prefs.darkMode !== undefined) setDarkMode(prefs.darkMode);
    if (prefs.hiddenStatuses !== undefined) {
      setHiddenStatuses(prefs.hiddenStatuses);
    }
    if (prefs.autoRedirect !== undefined) setAutoRedirect(prefs.autoRedirect);

    loadTasks({}, 0);
  }, [loadTasks]);

  useEffect(() => {
    initDashboard();
  }, [initDashboard]);

  const handlePreferencesChange = async (changes) => {
    const newDark = changes.darkMode !== undefined ? changes.darkMode : darkMode;
    const newHidden = changes.hiddenStatuses !== undefined ? changes.hiddenStatuses : hiddenStatuses;
    const newRedirect = changes.autoRedirect !== undefined ? changes.autoRedirect : autoRedirect;
    if (changes.darkMode !== undefined) setDarkMode(changes.darkMode);
    if (changes.hiddenStatuses !== undefined) setHiddenStatuses(changes.hiddenStatuses);
    if (changes.autoRedirect !== undefined) setAutoRedirect(changes.autoRedirect);
    await savePreferences({ darkMode: newDark, hiddenStatuses: newHidden, autoRedirect: newRedirect });
  };

  const getFilteredIssues = () => {
    if (!hiddenStatuses || hiddenStatuses.length === 0) return issues;
    const hidden = hiddenStatuses.map((s) => s.toLowerCase());
    return issues.filter((issue) => {
      const status = (issue.fields?.status?.name || '').toLowerCase();
      return !hidden.includes(status);
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
    loadTasks(newFilters, 0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadTasks(filters, newPage);
  };

  const handleRefresh = () => {
    loadTasks(filters, page);
  };

  const handleLogout = async () => {
    await clearSettings();
    setConfigured(false);
    setIssues([]);
    setTotal(0);
    setPage(0);
    setFilters({});
    setSiteUrl('');
  };

  if (!configured) {
    return <OnboardingForm onComplete={initDashboard} />;
  }

  const filteredIssues = getFilteredIssues();

  return (
    <div className="popup-container">
      <Header
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        darkMode={darkMode}
        hiddenStatuses={hiddenStatuses}
        autoRedirect={autoRedirect}
        onPreferencesChange={handlePreferencesChange}
      />
      <FilterBar filters={filters} onChange={handleFilterChange} />
      {loading ? (
        <div className="loading-container">
          <Spinner size="large" />
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button className="settings-link" onClick={handleRefresh}>Retry</button>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found matching your filters.</p>
        </div>
      ) : (
        <>
          <Dashboard issues={filteredIssues} siteUrl={siteUrl} />
          <Pagination
            page={page}
            total={total}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
