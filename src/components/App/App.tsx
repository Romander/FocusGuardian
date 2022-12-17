import React from 'react';
import { addSite, deleteSite, getCurrentSite, getSites } from '../../services/siteService';

import './App.css';

// async function init(sitesToBlock: string[], onGetCurrentTab: (tab: chrome.tabs.Tab) => void): Promise<void> {
//   return new Promise<void>((resolve, reject) => {
//       chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//           if(tabs.length === 0) {
//             reject("No tabs!");
//           };

//           onGetCurrentTab(tabs[0]);

//           if (!sitesToBlock.includes(new URL(tabs[0].url || '').hostname)) {
//             chrome.tabs.sendMessage(tabs[0].id!, {
//               message: 'show_overlay'
//             } as RequestChromeContentListener,
            
//             (response) => {
//                 if(!response) {
//                     reject("Something went wrong!");
//                 }
//                 console.log("Got response");
//                 console.log(response);
//                 resolve();
//             });
//           }
//       });
//   });
// };

function App() {
  const [url, setUrl] = React.useState<string | undefined>(undefined);
  const [blockedSites, setBlockedSites] = React.useState<string[]>([]);

  React.useEffect(() => {
    getSites(setBlockedSites);
    getCurrentSite((tab) => { setUrl(tab.url); })
  }, []);

  const handleAddSiteToBlockList = React.useCallback(() => {
    addSite(url?.toString() || '', setBlockedSites);
  }, [url]);

  const handleRemoveSiteFromBlockList = React.useCallback((site: string) => {
    deleteSite(site, setBlockedSites);
  }, []);

  return (
    <div className="App">
      <div className='site'>
        <div className='site-name' title={url}>
          {url}
        </div>
        <button onClick={handleAddSiteToBlockList}>✅</button>
      </div>
      {
        blockedSites.map((site, idx) => {
          return (
            <div key={idx} className='site'>
              <div className='site-name'>
                {site}
              </div>
              <button onClick={() => handleRemoveSiteFromBlockList(site)}>❌</button>
             </div>
          )
        })
      }
    </div>
  );
}

export { App }
