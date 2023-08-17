import React from "react";
import {
  addSiteToBlockListType,
  deleteSiteFromBlockListType,
  disableAllType,
} from "../constants";
import { getSettingsFromStorage } from "../services/settingsStorageService";
import { getSitesFromStorage } from "../services/siteStorageService";
import {
  AddMessage,
  BlockedSite,
  DeleteMessage,
  DisableAllChangeMessage,
  Settings,
} from "../types";
import { getHostnameFromUrl } from "../utils";

const Overlay = () => {
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const [settings, setSettings] = React.useState<Settings>({
    disableAll: false,
  });
  const [blockedSites, setBlockedSites] = React.useState<BlockedSite[]>([]);

  React.useEffect(() => {
    const onMessage = (
      message: AddMessage | DeleteMessage | DisableAllChangeMessage
    ) => {
      switch (message.type) {
        case addSiteToBlockListType:
          setBlockedSites((prev) => {
            return [...prev, (message as AddMessage).site];
          });

          break;
        case deleteSiteFromBlockListType:
          setBlockedSites((prev) => {
            return prev.filter(
              (x) => x.hostname !== (message as DeleteMessage).site.hostname
            );
          });

          if (
            !blockedSites
              .filter(
                (x) => x.hostname !== (message as DeleteMessage).site.hostname
              )
              .some(
                (x) => x.hostname === new URL(location?.href || "").hostname
              )
          ) {
            setShowOverlay(false);
          }

          break;
        case disableAllType:
          setSettings((prev) => ({
            ...prev,
            disableAll: (message as DisableAllChangeMessage).value,
          }));
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
    const includes = blockedSites.some(
      (x) => x.hostname === getHostnameFromUrl(location.href)
    );
    setShowOverlay(includes);
  }, [blockedSites]);

  React.useEffect(() => {
    if (showOverlay) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    if (settings?.disableAll) {
      document.body.classList.remove("overflow-hidden");
    }
  }, [settings?.disableAll, showOverlay]);

  if (settings?.disableAll) {
    return null;
  }

  if (showOverlay) {
    return (
      <div className="fixed inset-0 z-[10000] box-border flex items-center justify-center bg-[#1a1a1a]">
        <div className="z-10 text-4xl mt-12 text-honeydew font-mono text-white text-center">
          <p>🚫 Woah, traveler!</p>
          <p>🛡️ The FocusGuardian has spotted a sneaky distraction!</p>
          <p>
            This realm is off-limits.{" "}
            <a
              className="text-yellow-100"
              href="https://www.youtube.com/watch?v=ZXsQAXx_ao0"
            >
              Stay on the path of focus and productivity!
            </a>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export { Overlay };
