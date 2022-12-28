import React from 'react';
import { addSiteToBlockListType, deleteSiteFromBlockListType, disableAllType } from '../../constants';
import { getSettingsFromStorage } from '../../services/settingsStorageService';
import { getSitesFromStorage } from '../../services/siteStorageService';
import { AddMessage, BlockedSite, DeleteMessage, DisableAllChangeMessage, Settings } from '../../types';
import { getHostnameFromUrl } from '../../utils';

import './Overlay.css';

const Overlay = () => {
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const [settings, setSettings] = React.useState<Settings>({ disableAll: false });
  const [blockedSites, setBlockedSites] = React.useState<BlockedSite[]>([]);

  React.useEffect(() => {
    const onMessage = (message: AddMessage | DeleteMessage | DisableAllChangeMessage) => {
      switch (message.type) {
        case addSiteToBlockListType:
          setBlockedSites((prev) => {
            return [...prev, (message as AddMessage).site];
          });

          break;
        case deleteSiteFromBlockListType:
          setBlockedSites((prev) => {
            return prev.filter((x) => x.hostname !== (message as DeleteMessage).site.hostname);
          });

          if (
            !blockedSites
              .filter((x) => x.hostname !== (message as DeleteMessage).site.hostname)
              .some((x) => x.hostname === new URL(location?.href || '').hostname)
          ) {
            setShowOverlay(false);
          }

          break;
        case disableAllType:
          setSettings((prev) => ({ ...prev, disableAll: (message as DisableAllChangeMessage).value }));
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
    getSitesFromStorage(setBlockedSites);
    getSettingsFromStorage(setSettings);
  }, []);

  React.useEffect(() => {
    const includes = blockedSites.some((x) => x.hostname === getHostnameFromUrl(location.href));
    setShowOverlay(includes);
  }, [blockedSites]);

  if (settings?.disableAll) {
    return null;
  }

  if (showOverlay) {
    return (
      <div className="overlay">
        <img
          className="image"
          alt="background"
          src="https://live.staticflickr.com/65535/51943635421_d83259c7b7_k.jpg"
        />
        <div className="text">👨‍💻</div>
      </div>
    );
  }

  return null;
};

export { Overlay };
