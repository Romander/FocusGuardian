import React from 'react';
import { addSiteToStorage, deleteSiteFromStorage, getSitesFromStorage } from '../../services/siteStorageService';
import githubIcon from '../../icons/github.svg';
import { addSiteToBlockListType, deleteSiteFromBlockListType, disableAllType } from '../../constants';
import { getHostnameFromUrl } from '../../utils';
import { AddMessage, BlockedSite, DeleteMessage, DisableAllChangeMessage, Settings } from '../../types';
import { getCurrentTab } from '../../services/tabService';
import { getSettingsFromStorage, updateSettingsInStorage } from '../../services/settingsStorageService';

import './App.css';

const App = () => {
  const [tab, setTab] = React.useState<chrome.tabs.Tab>();
  const [blockedSites, setBlockedSites] = React.useState<BlockedSite[]>([]);
  const [settings, setSettings] = React.useState<Settings>({ disableAll: false });

  React.useEffect(() => {
    getSitesFromStorage(setBlockedSites);
    getSettingsFromStorage(setSettings);
    getCurrentTab((tab) => {
      setTab(tab);
    });
  }, []);

  const handleAddSiteToBlockList = React.useCallback(async () => {
    const url = tab?.url?.toString() ?? '';
    const hostname = getHostnameFromUrl(url);

    const siteToBlock: BlockedSite = { url, hostname, tabId: tab?.id ?? -1 };

    addSiteToStorage(siteToBlock, setBlockedSites);

    if (!blockedSites.some((site) => site.hostname === hostname)) {
      await chrome.tabs.sendMessage(
        tab?.id as number,
        {
          type: addSiteToBlockListType,
          site: siteToBlock,
        } as AddMessage,
      );
    }
  }, [blockedSites, tab?.id, tab?.url]);

  const handleRemoveSiteFromBlockList = React.useCallback(async (site: BlockedSite) => {
    deleteSiteFromStorage(site, setBlockedSites);

    await chrome.tabs.sendMessage(
      site.tabId as number,
      {
        type: deleteSiteFromBlockListType,
        site,
      } as DeleteMessage,
    );
  }, []);

  const handleSetDisabledAll = React.useCallback(async () => {
    updateSettingsInStorage({ disableAll: !settings.disableAll }, setSettings);

    for (const id of [...blockedSites.map((site) => site.tabId), tab?.id]) {
      await chrome.tabs.sendMessage(
        id as number,
        {
          type: disableAllType,
          value: !settings.disableAll,
        } as DisableAllChangeMessage,
      );
    }
  }, [blockedSites, settings.disableAll, tab?.id]);

  return (
    <div className="app">
      <div className="site">
        <div className="site-name" title={tab?.url}>
          {tab?.url}
        </div>
        <button className="button" onClick={handleAddSiteToBlockList}>
          ✅
        </button>
      </div>
      <div className="blocked-site-list">
        {blockedSites.map((site, idx) => {
          return (
            <div key={idx} className={settings?.disableAll ? 'site site-disabled' : 'site'}>
              <div className="site-name">{site.hostname}</div>
              <button className="button" onClick={async () => await handleRemoveSiteFromBlockList(site)}>
                ❌
              </button>
            </div>
          );
        })}
      </div>
      <footer className="footer">
        <div>
          <div className="checkbox">
            <input
              type="checkbox"
              placeholder="Disable All"
              checked={settings?.disableAll}
              onChange={handleSetDisabledAll}
            />
            <div>Disable All</div>
          </div>
        </div>
        <a href="https://github.com/Romander" target="_blank" rel="noreferrer">
          <img src={chrome.runtime.getURL(githubIcon)} alt="GitHub" />
        </a>
      </footer>
    </div>
  );
};

export { App };
