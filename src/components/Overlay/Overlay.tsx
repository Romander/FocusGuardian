import React from 'react';
import { getCurrentSite, getSites } from '../../services/siteService';

import './Overlay.css'

// function init(onShowOverlay: () => void) {
//   chrome.runtime.onMessage.addListener(
//     (request: RequestChromeContentListener, _, sendResponse) => {
//       if (request.message === 'show_overlay') {
//         onShowOverlay();
//       }
//       sendResponse(true);
//     }
//   );
// };

function Overlay() {
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const [blockedSites, setBlockedSites] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    getSites(setBlockedSites);
  }, []);

  React.useEffect(() => {
    console.log(location.href);
    console.log(blockedSites, new URL(location.href || '').hostname);

    if (blockedSites.includes(new URL(location.href || '').hostname)) {
      setShowOverlay(true);
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    }
  }, [blockedSites]);

  console.log('showing overlay', showOverlay);

  if(!showOverlay) {
    return null;
  }
  
  return (
    <div className="overlay">
      <h1 className="text">Stay Focused 👨‍💻</h1>
    </div>
  );
}

export { Overlay }
