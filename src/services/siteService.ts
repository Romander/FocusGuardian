export const getSites = (success: (sites: string[]) => void): void => {
  chrome.storage.sync.get(['sitesToBlock'], (result) => {
      success(result.sitesToBlock || []);
    });
};

export const getCurrentSite = (success: (tab: chrome.tabs.Tab) => void): void => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(tabs.length === 0) {
        return;
    };

    success(tabs[0]);
  }) 
};

export const addSite = (site: string, success: (sites: string[]) => void): void => {
    chrome.storage.sync.get(['sitesToBlock'], (result) => {
        const sitesToBlock = result.sitesToBlock || [];
  
        const urlObject = new URL(site || '');
  
        if (!sitesToBlock.includes(urlObject.hostname)) {
          sitesToBlock.push(urlObject.hostname);
        }
  
        chrome.storage.sync.set({sitesToBlock}, () => {
          success(sitesToBlock);
        });
      });
};

export const deleteSite = (site: string, success: (sites: string[]) => void): void => {
  chrome.storage.sync.get(['sitesToBlock'], (result) => {
      let sitesToBlock = result.sitesToBlock || [];
      sitesToBlock.splice(sitesToBlock.indexOf(site), 1);
      chrome.storage.sync.set({sitesToBlock}, () => {
          success(sitesToBlock);
      });
  });
};