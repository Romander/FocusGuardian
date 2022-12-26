import React from 'react';
import { addSiteToBlockListType, deleteSiteFromBlockListType } from '../../constants';
import { getSites } from '../../services/siteService';
import { getHostnameFromUrl } from '../../utils';

import './Overlay.css';

const Overlay = () => {
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const [blockedSites, setBlockedSites] = React.useState<string[]>([]);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((...args) => {
      const urlToAdd = args.find((x) => x.type === addSiteToBlockListType)?.url;
      const siteToDelete = args.find((x) => x.type === deleteSiteFromBlockListType)?.site;

      console.log(urlToAdd, siteToDelete);

      if (urlToAdd) {
        setBlockedSites((prev) => {
          return [...prev, getHostnameFromUrl(urlToAdd)];
        });
      }

      if (siteToDelete) {
        setBlockedSites((prev) => {
          return prev.filter((x) => x !== siteToDelete);
        });

        if (!blockedSites.filter((x) => x !== siteToDelete).includes(new URL(location?.href || '').hostname)) {
          setShowOverlay(false);
        }
      }
    });
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
      <h1 className="text">Stay Focused 👨‍💻</h1>
    </div>
  );
};

export { Overlay };
