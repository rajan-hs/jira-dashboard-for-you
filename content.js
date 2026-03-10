(function () {
  const BUTTON_ID = 'jira-ext-dashboard-btn';

  function createButton() {
    const span = document.createElement('span');
    span.setAttribute('role', 'listitem');
    span.id = BUTTON_ID;

    span.innerHTML = `
      <div style="display:flex;align-items:center;">
        <button type="button" class="jira-ext-nav-btn" title="Open Jira Task Dashboard">
          <span style="display:flex;align-items:center;gap:4px;">
            <span aria-label="Jira Extension" role="img" style="display:flex;align-items:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#0052CC"/>
                <path d="M12 7l-5 5 5 5 5-5-5-5zm0 2.5l2.5 2.5-2.5 2.5-2.5-2.5L12 9.5z" fill="#fff"/>
              </svg>
            </span>
            <span>Jira Extension</span>
          </span>
        </button>
      </div>
    `;

    span.querySelector('button').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openDashboard' });
    });

    return span;
  }

  function injectButton() {
    if (document.getElementById(BUTTON_ID)) return;

    // Look for the nav actions area where extension buttons live
    // Jira uses role="listitem" spans inside a nav bar actions container
    const selectors = [
      'nav[aria-label="Primary"] [role="list"]',
      'nav [role="list"]',
      '[data-testid="atlassian-navigation--primary-actions"] [role="list"]',
      '[data-testid="atlassian-navigation"] [role="list"]',
    ];

    let container = null;
    for (const sel of selectors) {
      container = document.querySelector(sel);
      if (container) break;
    }

    if (!container) return;

    const button = createButton();
    container.insertBefore(button, container.firstChild);
  }

  // Jira is a SPA — observe DOM changes to inject when nav renders
  const observer = new MutationObserver(() => {
    injectButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately and after a short delay
  injectButton();
  document.addEventListener('DOMContentLoaded', injectButton);
})();
