const DASHBOARD_PATH = 'src/popup/index.html';

function openDashboard() {
  const dashboardUrl = chrome.runtime.getURL(DASHBOARD_PATH);
  chrome.tabs.query({ url: dashboardUrl }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
      chrome.windows.update(tabs[0].windowId, { focused: true });
    } else {
      chrome.tabs.create({ url: dashboardUrl });
    }
  });
}

chrome.action.onClicked.addListener(openDashboard);

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'openDashboard') {
    openDashboard();
  }
});
