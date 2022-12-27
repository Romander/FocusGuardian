import React from 'react';
import { addSite, deleteSite, getCurrentSite, getSites } from '../../services/siteService';
import githubIcon from '../../icons/github.svg';
import { addSiteToBlockListType, deleteSiteFromBlockListType } from '../../constants';
import { getHostnameFromUrl } from '../../utils';
import { AddMessage, DeleteMessage } from '../../types';

import './App.css';

const App = () => {
  const [tab, setTab] = React.useState<chrome.tabs.Tab>();
  const [blockedSites, setBlockedSites] = React.useState<string[]>([]);

  React.useEffect(() => {
    getSites(setBlockedSites);
    getCurrentSite((tab) => {
      setTab(tab);
    });
  }, []);

  const handleAddSiteToBlockList = React.useCallback(async () => {
    addSite(tab?.url?.toString() ?? '', setBlockedSites);

    console.log(blockedSites.includes(getHostnameFromUrl(tab?.url?.toString() || '')));

    if (!blockedSites.includes(getHostnameFromUrl(tab?.url?.toString() || ''))) {
      await chrome.tabs.sendMessage(
        tab?.id as number,
        {
          type: addSiteToBlockListType,
          url: tab?.url?.toString(),
        } as AddMessage,
      );

      console.log('added site to block list', tab?.url?.toString());
    }
  }, [blockedSites, tab?.id, tab?.url]);

  const handleRemoveSiteFromBlockList = React.useCallback(
    async (site: string) => {
      deleteSite(site, setBlockedSites);

      await chrome.tabs.sendMessage(
        tab?.id as number,
        {
          type: deleteSiteFromBlockListType,
          site: getHostnameFromUrl(tab?.url?.toString() || ''),
        } as DeleteMessage,
      );

      console.log('removed site from block list', site);
    },
    [tab],
  );

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
            <div key={idx} className="site">
              <div className="site-name">{site}</div>
              <button className="button" onClick={async () => await handleRemoveSiteFromBlockList(site)}>
                ❌
              </button>
            </div>
          );
        })}
      </div>
      <footer className="footer">
        <a href="https://github.com/Romander" target="_blank" rel="noreferrer">
          <img src={chrome.runtime.getURL(githubIcon)} alt="GitHub" />
        </a>
      </footer>
    </div>
  );
};

export { App };
