import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../services/storage.js';
import { testConnection } from '../services/jiraApi.js';

const styles = {
  container: {
    maxWidth: 500,
    margin: '40px auto',
    padding: '32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  title: { fontSize: 24, fontWeight: 600, color: '#172b4d', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b778c', marginBottom: 32 },
  field: { marginBottom: 20 },
  label: {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#6b778c',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6,
  },
  input: {
    width: '100%', padding: '8px 10px', fontSize: 14,
    border: '2px solid #dfe1e6', borderRadius: 3, outline: 'none', boxSizing: 'border-box',
  },
  hint: { fontSize: 12, color: '#97a0af', marginTop: 4 },
  actions: { display: 'flex', gap: 8, marginTop: 24 },
  btnPrimary: {
    padding: '8px 16px', fontSize: 14, border: 'none', borderRadius: 3,
    cursor: 'pointer', fontWeight: 500, background: '#0052cc', color: '#fff',
  },
  btnSecondary: {
    padding: '8px 16px', fontSize: 14, border: 'none', borderRadius: 3,
    cursor: 'pointer', fontWeight: 500, background: '#f4f5f7', color: '#172b4d',
  },
  message: { marginTop: 16, padding: '12px 16px', borderRadius: 3, fontSize: 14 },
  success: { background: '#e3fcef', color: '#006644' },
  error: { background: '#ffebe6', color: '#de350b' },
  link: { color: '#0052cc', textDecoration: 'none' },
};

export default function Options() {
  const [siteUrl, setSiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getSettings().then((s) => {
      setSiteUrl(s.siteUrl || '');
      setEmail(s.email || '');
      setApiToken(s.apiToken || '');
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await saveSettings({ siteUrl, email, apiToken });
      setMessage({ type: 'success', text: 'Settings saved.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    }
    setSaving(false);
  };

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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Jira Dashboard Settings</h1>
      <p style={styles.subtitle}>Configure your Jira connection credentials.</p>

      <div style={styles.field}>
        <label style={styles.label}>Jira Site URL</label>
        <input
          style={styles.input}
          placeholder="https://yoursite.atlassian.net"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
        />
        <p style={styles.hint}>Your Atlassian Cloud site URL</p>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>API Token</label>
        <input
          style={styles.input}
          type="password"
          placeholder="Your Jira API token"
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
        />
        <p style={styles.hint}>
          Generate a token at{' '}
          <a
            href="https://id.atlassian.com/manage-profile/security/api-tokens"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Atlassian API Tokens
          </a>
        </p>
      </div>

      <div style={styles.actions}>
        <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
        <button style={styles.btnSecondary} onClick={handleTest} disabled={testing}>
          {testing ? 'Testing…' : 'Test Connection'}
        </button>
      </div>

      {message && (
        <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
          {message.text}
        </div>
      )}
    </div>
  );
}
