chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('src/popup/index.html') });
});

// Auto-redirect Jira "For You" page to extension dashboard
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && /^https:\/\/[^/]+\.atlassian\.net\/jira\/for-you/.test(changeInfo.url)) {
    chrome.storage.sync.get(['autoRedirect'], (result) => {
      if (result.autoRedirect) {
        chrome.tabs.update(tabId, { url: chrome.runtime.getURL('src/popup/index.html') });
      }
    });
  }
});
