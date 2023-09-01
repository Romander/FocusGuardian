import { useCallback, useEffect, useState } from "react";

import {
  addSiteToBlockListType,
  deleteSiteFromBlockListType,
  updateSettingsType,
} from "../../constants";
import githubIcon from "../../icons/github.svg";
import {
  getSettingsFromStorage,
  updateSettingsInStorage,
} from "../../services/settingsStorageService";
import {
  addSiteToStorage,
  deleteSiteFromStorage,
  getSitesFromStorage,
} from "../../services/siteStorageService";
import { getCurrentTab } from "../../services/tabService";
import {
  AddMessage,
  BlockedSite,
  DeleteMessage,
  Settings,
  SettingsChangeMessage,
} from "../../types";
import { getHostnameFromUrl } from "../../utils";
import { localToUTCTime, utcToLocalTime } from "../../utils/timeUtils";
import { Button } from "../Common/Button";
import { TimePicker } from "../Common/TimePicker";
import { WeekdayPicker } from "../Common/WeekdayPicker";

const App = () => {
  const [tab, setTab] = useState<chrome.tabs.Tab>();
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [settings, setSettings] = useState<Settings>({
    blockedDays: [],
    timeFrom: "",
    timeTo: "",
  });

  useEffect(() => {
    getSitesFromStorage(setBlockedSites);
    getSettingsFromStorage(setSettings);
    getCurrentTab((tab) => {
      setTab(tab);
    });
  }, []);

  const handleAddSiteToBlockList = useCallback(async () => {
    const url = tab?.url?.toString() ?? "";
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

  const handleRemoveSiteFromBlockList = useCallback(
    async (site: BlockedSite) => {
      if (
        confirm(
          'Ask yourself: "Is unblocking this site helping me get closer to my goals, or is it merely a momentary distraction that will cost me progress?"',
        )
      ) {
        deleteSiteFromStorage(site, setBlockedSites);

        await chrome.tabs.sendMessage(
          site.tabId as number,
          {
            type: deleteSiteFromBlockListType,
            site,
          } as DeleteMessage,
        );
      }
    },
    [],
  );

  const sendNewSettingsToAllTabs = useCallback(
    async (newSettings: Partial<Settings>) => {
      for (const id of [...blockedSites.map((site) => site.tabId), tab?.id]) {
        await chrome.tabs.sendMessage(
          id as number,
          {
            type: updateSettingsType,
            value: { ...settings, ...newSettings },
          } as SettingsChangeMessage,
        );
      }
    },
    [blockedSites, settings, tab?.id],
  );

  const handleSetTimeTo = useCallback(
    async (timeTo: string) => {
      updateSettingsInStorage(
        {
          timeTo,
        },
        setSettings,
      );

      sendNewSettingsToAllTabs({
        timeTo,
      });
    },
    [sendNewSettingsToAllTabs],
  );

  const handleSetTimeFrom = useCallback(
    async (timeFrom: string) => {
      updateSettingsInStorage(
        {
          timeFrom,
        },
        setSettings,
      );

      sendNewSettingsToAllTabs({
        timeFrom,
      });
    },
    [sendNewSettingsToAllTabs],
  );

  const handleDaysChange = useCallback(
    async (days: string[]) => {
      updateSettingsInStorage(
        {
          blockedDays: days,
        },
        setSettings,
      );

      sendNewSettingsToAllTabs({
        blockedDays: days,
      });
    },
    [sendNewSettingsToAllTabs],
  );

  return (
    <div className="flex flex-col items-center min-h-[400px] max-h-[550px] w-[300px] bg-[#242424] text-white text-opacity-87 font-sans antialiased leading-[1]">
      <div className="flex items-center justify-center w-full p-2 bg-[#1a1a1a]">
        <div className="truncate" title={tab?.url}>
          {tab?.url}
        </div>
        <Button title="Block current site" onClick={handleAddSiteToBlockList}>
          🔒
        </Button>
      </div>
      {blockedSites?.length > 0 ? (
        <div className="flex flex-col flex-1 items-center w-full h-full overflow-auto">
          {blockedSites.map((site, idx) => {
            return (
              <div
                key={idx}
                className={"flex items-center justify-center w-full p-5"}
              >
                <div className="truncate">{site.hostname}</div>
                <Button
                  title="Unblock site"
                  onClick={async () =>
                    await handleRemoveSiteFromBlockList(site)
                  }
                >
                  🔓
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center w-full h-full text-center leading-loose">
          <p>Greetings, champion of focus! 🌟</p>
          <p>All realms are open to you for now. </p>
          <p>
            Is this a land of distraction you wish the FocusGuardian to guard
            against?
          </p>
        </div>
      )}

      <WeekdayPicker
        selectedDays={settings.blockedDays}
        onChange={handleDaysChange}
      />

      <div className="flex p-2">
        <TimePicker
          value={utcToLocalTime(settings.timeFrom)}
          onChange={(e) => handleSetTimeFrom(localToUTCTime(e.target.value))}
        />
        <TimePicker
          value={utcToLocalTime(settings.timeTo)}
          onChange={(e) => handleSetTimeTo(localToUTCTime(e.target.value))}
        />
      </div>

      <footer className="flex flex-col items-center p-2">
        <a
          href="https://github.com/Romander/FocusGuardian"
          target="_blank"
          rel="noreferrer"
        >
          <img src={chrome.runtime.getURL(githubIcon)} alt="GitHub" />
        </a>
      </footer>
    </div>
  );
};

export { App };
