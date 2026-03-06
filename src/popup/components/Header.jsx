import React, { useState, useRef, useEffect } from 'react';

export default function Header({ onRefresh, onLogout, darkMode, hiddenStatuses, autoRedirect, onPreferencesChange }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [statusInput, setStatusInput] = useState('');
  const panelRef = useRef(null);
  const gearRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSettings &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        gearRef.current &&
        !gearRef.current.contains(e.target)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  const handleAddStatus = (e) => {
    if (e.key === 'Enter' && statusInput.trim()) {
      const current = hiddenStatuses || [];
      const val = statusInput.trim();
      if (!current.some((s) => s.toLowerCase() === val.toLowerCase())) {
        onPreferencesChange({ hiddenStatuses: [...current, val] });
      }
      setStatusInput('');
    }
  };

  const handleRemoveStatus = (status) => {
    const current = hiddenStatuses || [];
    onPreferencesChange({ hiddenStatuses: current.filter((s) => s !== status) });
  };

  const handleLogout = () => {
    setShowConfirm(false);
    setShowSettings(false);
    onLogout();
  };

  return (
    <>
      <div className="header">
        <div className="header-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#2684FF">
            <path d="M11.571 5.926L5.026 12.47l6.545 6.545 6.545-6.545-6.545-6.544zm0 2.829l3.716 3.716-3.716 3.716-3.716-3.716 3.716-3.716z"/>
            <path d="M11.571.098L.07 11.598a.24.24 0 000 .339l5.49 5.49 6.011-6.011L5.56 5.405 11.571.098z" opacity=".4"/>
            <path d="M17.583 5.926l-6.012 6.011 6.012 6.012 5.49-5.49a.24.24 0 000-.34l-5.49-5.49-.001-.703z" opacity=".4"/>
          </svg>
          <h1 className="header-title">My Jira Tasks</h1>
        </div>
        <div className="header-actions">
          <button className="btn-icon" onClick={onRefresh} aria-label="Refresh">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 2L13 3.99545L12.9408 4.05474M13 18.0001L11 19.9108L11.0297 19.9417M12.9408 4.05474L11 6M12.9408 4.05474C12.6323 4.01859 12.3183 4 12 4C7.58172 4 4 7.58172 4 12C4 14.5264 5.17107 16.7793 7 18.2454M17 5.75463C18.8289 7.22075 20 9.47362 20 12C20 16.4183 16.4183 20 12 20C11.6716 20 11.3477 19.9802 11.0297 19.9417M13 22.0001L11.0297 19.9417"/>
            </svg>
          </button>
          <div style={{ position: 'relative' }}>
            <button ref={gearRef} className="btn-icon" onClick={() => setShowSettings(!showSettings)} aria-label="Settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.0002 8C9.79111 8 8.00024 9.79086 8.00024 12C8.00024 14.2091 9.79111 16 12.0002 16C14.2094 16 16.0002 14.2091 16.0002 12C16.0002 9.79086 14.2094 8 12.0002 8ZM10.0002 12C10.0002 10.8954 10.8957 10 12.0002 10C13.1048 10 14.0002 10.8954 14.0002 12C14.0002 13.1046 13.1048 14 12.0002 14C10.8957 14 10.0002 13.1046 10.0002 12Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.2867 0.5C9.88583 0.5 8.6461 1.46745 8.37171 2.85605L8.29264 3.25622C8.10489 4.20638 7.06195 4.83059 6.04511 4.48813L5.64825 4.35447C4.32246 3.90796 2.83873 4.42968 2.11836 5.63933L1.40492 6.83735C0.67773 8.05846 0.954349 9.60487 2.03927 10.5142L2.35714 10.7806C3.12939 11.4279 3.12939 12.5721 2.35714 13.2194L2.03927 13.4858C0.954349 14.3951 0.67773 15.9415 1.40492 17.1626L2.11833 18.3606C2.83872 19.5703 4.3225 20.092 5.64831 19.6455L6.04506 19.5118C7.06191 19.1693 8.1049 19.7935 8.29264 20.7437L8.37172 21.1439C8.6461 22.5325 9.88584 23.5 11.2867 23.5H12.7136C14.1146 23.5 15.3543 22.5325 15.6287 21.1438L15.7077 20.7438C15.8954 19.7936 16.9384 19.1693 17.9553 19.5118L18.3521 19.6455C19.6779 20.092 21.1617 19.5703 21.8821 18.3606L22.5955 17.1627C23.3227 15.9416 23.046 14.3951 21.9611 13.4858L21.6432 13.2194C20.8709 12.5722 20.8709 11.4278 21.6432 10.7806L21.9611 10.5142C23.046 9.60489 23.3227 8.05845 22.5955 6.83732L21.8821 5.63932C21.1617 4.42968 19.678 3.90795 18.3522 4.35444L17.9552 4.48814C16.9384 4.83059 15.8954 4.20634 15.7077 3.25617L15.6287 2.85616C15.3543 1.46751 14.1146 0.5 12.7136 0.5H11.2867ZM10.3338 3.24375C10.4149 2.83334 10.7983 2.5 11.2867 2.5H12.7136C13.2021 2.5 13.5855 2.83336 13.6666 3.24378L13.7456 3.64379C14.1791 5.83811 16.4909 7.09167 18.5935 6.38353L18.9905 6.24984C19.4495 6.09527 19.9394 6.28595 20.1637 6.66264L20.8771 7.86064C21.0946 8.22587 21.0208 8.69271 20.6764 8.98135L20.3586 9.24773C18.6325 10.6943 18.6325 13.3057 20.3586 14.7523L20.6764 15.0186C21.0208 15.3073 21.0946 15.7741 20.8771 16.1394L20.1637 17.3373C19.9394 17.714 19.4495 17.9047 18.9905 17.7501L18.5936 17.6164C16.4909 16.9082 14.1791 18.1618 13.7456 20.3562L13.6666 20.7562C13.5855 21.1666 13.2021 21.5 12.7136 21.5H11.2867C10.7983 21.5 10.4149 21.1667 10.3338 20.7562L10.2547 20.356C9.82113 18.1617 7.50931 16.9082 5.40665 17.6165L5.0099 17.7501C4.55092 17.9047 4.06104 17.714 3.83671 17.3373L3.1233 16.1393C2.9058 15.7741 2.97959 15.3073 3.32398 15.0186L3.64185 14.7522C5.36782 13.3056 5.36781 10.6944 3.64185 9.24779L3.32398 8.98137C2.97959 8.69273 2.9058 8.2259 3.1233 7.86067L3.83674 6.66266C4.06106 6.28596 4.55093 6.09528 5.0099 6.24986L5.40676 6.38352C7.50938 7.09166 9.82112 5.83819 10.2547 3.64392L10.3338 3.24375Z" fill="currentColor"/>
              </svg>
            </button>
            {showSettings && (
              <div ref={panelRef} className="settings-panel">
                <div className="settings-section-row">
                  <label className="settings-label" style={{ margin: 0 }}>Dark Mode</label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={darkMode || false}
                      onChange={(e) => onPreferencesChange({ darkMode: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="settings-section">
                  <label className="settings-label">Hide Tickets by Status</label>
                  <input
                    className="settings-input"
                    type="text"
                    placeholder="Type status & press Enter"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    onKeyDown={handleAddStatus}
                  />
                  {(hiddenStatuses || []).length > 0 && (
                    <div className="hidden-tags">
                      {(hiddenStatuses || []).map((s) => (
                        <span key={s} className="hidden-tag">
                          {s}
                          <button className="hidden-tag-remove" onClick={() => handleRemoveStatus(s)}>&times;</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="settings-section-row">
                  <div>
                    <label className="settings-label" style={{ margin: 0 }}>Auto Redirect</label>
                    <span className="settings-hint">Redirect Jira "For You" page here</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={autoRedirect || false}
                      onChange={(e) => onPreferencesChange({ autoRedirect: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="settings-divider"></div>
                <button className="settings-logout" onClick={() => setShowConfirm(true)}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Logout</h3>
            <p className="confirm-text">This will clear your saved Jira credentials. You'll need to re-enter them to use the dashboard again.</p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
