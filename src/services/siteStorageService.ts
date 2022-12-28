import { BlockedSite } from '../types';

export const getSitesFromStorage = (success: (sites: BlockedSite[]) => void): void => {
  chrome.storage.sync.get(['sitesToBlock'], (result) => {
    success(result.sitesToBlock || []);
  });
};

export const addSiteToStorage = (addSite: BlockedSite, success: (sites: BlockedSite[]) => void): void => {
  chrome.storage.sync.get(['sitesToBlock'], (result) => {
    const sitesToBlock: BlockedSite[] = result.sitesToBlock || [];

    if (!sitesToBlock.some((site) => site.hostname === addSite.hostname)) {
      sitesToBlock.push(addSite);
    }

    chrome.storage.sync.set({ sitesToBlock }, () => {
      success(sitesToBlock);
    });
  });
};

export const deleteSiteFromStorage = (deleteRequest: BlockedSite, success: (sites: BlockedSite[]) => void): void => {
  chrome.storage.sync.get(['sitesToBlock'], (result) => {
    const sitesToBlock: BlockedSite[] = result.sitesToBlock || [];
    sitesToBlock.splice(
      sitesToBlock.findIndex((site) => deleteRequest.hostname === site.hostname),
      1,
    );
    chrome.storage.sync.set({ sitesToBlock }, () => {
      success(sitesToBlock);
    });
  });
};
