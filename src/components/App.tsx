import React from "react";
import {
  addSiteToStorage,
  deleteSiteFromStorage,
  getSitesFromStorage,
} from "../services/siteStorageService";
import githubIcon from "../icons/github.svg";
import {
  addSiteToBlockListType,
  deleteSiteFromBlockListType,
  updateSettingsType,
} from "../constants";
import { getHostnameFromUrl } from "../utils";
import {
  AddMessage,
  BlockedSite,
  DeleteMessage,
  Settings,
  SettingsChangeMessage,
} from "../types";
import { getCurrentTab } from "../services/tabService";
import {
  getSettingsFromStorage,
  updateSettingsInStorage,
} from "../services/settingsStorageService";
import { WeekdayPicker } from "./WeekdayPicker";
import { localToUTCTime, utcToLocalTime } from "../utils/timeUtils";

const App = () => {
  const [tab, setTab] = React.useState<chrome.tabs.Tab>();
  const [blockedSites, setBlockedSites] = React.useState<BlockedSite[]>([]);
  const [settings, setSettings] = React.useState<Settings>({
    disableAll: false,
    blockedDays: [],
    timeFrom: "",
    timeTo: "",
  });

  React.useEffect(() => {
    getSitesFromStorage(setBlockedSites);
    getSettingsFromStorage(setSettings);
    getCurrentTab((tab) => {
      setTab(tab);
    });
  }, []);

  const handleAddSiteToBlockList = React.useCallback(async () => {
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
        } as AddMessage
      );
    }
  }, [blockedSites, tab?.id, tab?.url]);

  const handleRemoveSiteFromBlockList = React.useCallback(
    async (site: BlockedSite) => {
      if (
        confirm(
          'Ask yourself: "Is unblocking this site helping me get closer to my goals, or is it merely a momentary distraction that will cost me progress?"'
        )
      ) {
        deleteSiteFromStorage(site, setBlockedSites);

        await chrome.tabs.sendMessage(
          site.tabId as number,
          {
            type: deleteSiteFromBlockListType,
            site,
          } as DeleteMessage
        );
      }
    },
    []
  );

  const sendNewSettingsToAllTabs = React.useCallback(
    async (newSettings: Partial<Settings>) => {
      for (const id of [...blockedSites.map((site) => site.tabId), tab?.id]) {
        await chrome.tabs.sendMessage(
          id as number,
          {
            type: updateSettingsType,
            value: { ...settings, ...newSettings },
          } as SettingsChangeMessage
        );
      }
    },
    [blockedSites, settings, tab?.id]
  );

  const handleSetTimeTo = React.useCallback(
    async (timeTo: string) => {
      updateSettingsInStorage(
        {
          timeTo,
        },
        setSettings
      );

      sendNewSettingsToAllTabs({
        timeTo,
      });
    },
    [sendNewSettingsToAllTabs]
  );

  const handleSetTimeFrom = React.useCallback(
    async (timeFrom: string) => {
      updateSettingsInStorage(
        {
          timeFrom,
        },
        setSettings
      );

      sendNewSettingsToAllTabs({
        timeFrom,
      });
    },
    [sendNewSettingsToAllTabs]
  );

  const handleDaysChange = React.useCallback(
    async (days: string[]) => {
      updateSettingsInStorage(
        {
          blockedDays: days,
        },
        setSettings
      );

      sendNewSettingsToAllTabs({
        blockedDays: days,
      });
    },
    [sendNewSettingsToAllTabs]
  );

  return (
    <div className="flex flex-col items-center min-h-[400px] max-h-[550px] w-[300px] bg-[#242424] text-white text-opacity-87 font-sans antialiased leading-[1]">
      <div className="flex items-center justify-center w-full p-2 bg-[#1a1a1a]">
        <div className="truncate" title={tab?.url}>
          {tab?.url}
        </div>
        <button
          title="Block current site"
          className="rounded-lg border border-transparent p-2 text-base font-semibold bg-[#1a1a1a] cursor-pointer transition-border duration-200 ease-in ml-auto hover:border-[#646cff] focus:ring focus:ring-webkit-focus-ring-color"
          onClick={handleAddSiteToBlockList}
        >
          🔒
        </button>
      </div>
      {blockedSites?.length > 0 ? (
        <div className="flex flex-col flex-1 items-center w-full h-full overflow-auto">
          {blockedSites.map((site, idx) => {
            return (
              <div
                key={idx}
                className={
                  settings?.disableAll
                    ? "flex items-center justify-center w-full p-5 opacity-50"
                    : "flex items-center justify-center w-full p-5"
                }
              >
                <div className="truncate">{site.hostname}</div>
                <button
                  title="Unblock site"
                  className="rounded-lg border border-transparent p-2 text-base font-semibold bg-[#1a1a1a] cursor-pointer transition-border duration-200 ease-in ml-auto hover:border-[#646cff] focus:ring focus:ring-webkit-focus-ring-color"
                  onClick={async () =>
                    await handleRemoveSiteFromBlockList(site)
                  }
                >
                  🔓
                </button>
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
        <input
          className="appearance-none text-center p-2 border border-gray-300 rounded shadow-sm bg-white text-black"
          type="time"
          value={utcToLocalTime(settings.timeFrom)}
          onChange={(e) => handleSetTimeFrom(localToUTCTime(e.target.value))}
        />
        <input
          className="appearance-none text-center p-2 border border-gray-300 rounded shadow-sm bg-white text-black"
          type="time"
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
