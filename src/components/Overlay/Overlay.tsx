import React from 'react';
import { addSiteToBlockListType, deleteSiteFromBlockListType } from '../../constants';
import { getSites } from '../../services/siteService';
import { AddMessage, DeleteMessage } from '../../types';
import { getHostnameFromUrl } from '../../utils';

import './Overlay.css';

const Overlay = () => {
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const [blockedSites, setBlockedSites] = React.useState<string[]>([]);

  React.useEffect(() => {
    const onMessage = (message: AddMessage | DeleteMessage) => {
      console.log(message);

      switch (message.type) {
        case addSiteToBlockListType:
          setBlockedSites((prev) => {
            return [...prev, getHostnameFromUrl((message as AddMessage).url)];
          });

          break;
        case deleteSiteFromBlockListType:
          setBlockedSites((prev) => {
            return prev.filter((x) => x !== (message as DeleteMessage).site);
          });

          if (
            !blockedSites
              .filter((x) => x !== (message as DeleteMessage).site)
              .includes(new URL(location?.href || '').hostname)
          ) {
            setShowOverlay(false);
          }

          break;
        default:
          break;
      }
    };

    chrome.runtime.onMessage.addListener(onMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getSites(setBlockedSites);
  }, []);

  React.useEffect(() => {
    if (blockedSites.includes(new URL(location.href || '').hostname)) {
      setShowOverlay(true);
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    }
  }, [blockedSites]);

  if (!showOverlay) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="text">Stay Focused 👨‍💻</div>
    </div>
  );
};

export { Overlay };
