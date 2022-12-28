export const getCurrentTab = (success: (tab: chrome.tabs.Tab) => void): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      return;
    }

    success(tabs[0]);
  });
};
