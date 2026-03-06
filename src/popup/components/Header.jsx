import React, { useState } from 'react';

export default function Header({ onRefresh, onLogout }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(false);
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
          <button className="btn-subtle" onClick={onRefresh} aria-label="Refresh">
            ↻ Refresh
          </button>
          <button className="btn-logout" onClick={() => setShowConfirm(true)} aria-label="Logout">
            Logout
          </button>
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
