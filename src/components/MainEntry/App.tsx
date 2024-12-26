import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
import { LangType } from "../../types/lang";
import { getHostnameFromUrl } from "../../utils";
import { localToUTCTime, utcToLocalTime } from "../../utils/timeUtils";
import { Button } from "../Common/Button";
import { LanguageSwitcher } from "../Common/LanguageSwitcher";
import { TimePicker } from "../Common/TimePicker";
import { WeekdayPicker } from "../Common/WeekdayPicker";

const App = () => {
  const { t, i18n } = useTranslation();

  const [tab, setTab] = useState<chrome.tabs.Tab>();
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [settings, setSettings] = useState<Settings>({
    blockedDays: [],
    timeFrom: "",
    timeTo: "",
    langCode: i18n.language as "en" | "ru",
  });

  useEffect(() => {
    getSitesFromStorage(setBlockedSites);
    getSettingsFromStorage((newSettings) => {
      setSettings(newSettings);
      // Sync i18n language with stored settings
      if (newSettings.langCode && newSettings.langCode !== i18n.language) {
        i18n.changeLanguage(newSettings.langCode).catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Error changing language:", error);
        });
      }
    });
    getCurrentTab((tab) => {
      setTab(tab);
    });
  }, [i18n]);

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
      if (confirm(t("app_remove_site_confirm"))) {
        deleteSiteFromStorage(site, setBlockedSites);

        await chrome.tabs.sendMessage(site.tabId, {
          type: deleteSiteFromBlockListType,
          site,
        } as DeleteMessage);
      }
    },
    [t],
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
    async (timeTo: string | null) => {
      if (timeTo === null) {
        return;
      }

      updateSettingsInStorage(
        {
          timeTo,
        },
        setSettings,
      );

      await sendNewSettingsToAllTabs({
        timeTo,
      });
    },
    [sendNewSettingsToAllTabs],
  );

  const handleSetTimeFrom = useCallback(
    async (timeFrom: string | null) => {
      if (timeFrom === null) {
        return;
      }

      updateSettingsInStorage(
        {
          timeFrom,
        },
        setSettings,
      );

      await sendNewSettingsToAllTabs({
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

      await sendNewSettingsToAllTabs({
        blockedDays: days,
      });
    },
    [sendNewSettingsToAllTabs],
  );

  const handleChangeLang = useCallback(
    async (langCode: LangType) => {
      updateSettingsInStorage(
        {
          langCode,
        },
        setSettings,
      );

      await sendNewSettingsToAllTabs({
        langCode,
      });
    },
    [sendNewSettingsToAllTabs],
  );

  return (
    <div className="flex flex-col items-center min-h-[400px] max-h-[550px] w-[300px] bg-[#242424] text-white text-opacity-87 font-sans antialiased leading-[1] gap-2">
      <div className="flex items-center justify-center w-full p-2 bg-[#1a1a1a] shadow-lg">
        <div className="truncate" title={tab?.url}>
          {tab?.url}
        </div>
        <Button
          title={t("app_button_block")}
          onClick={() => {
            handleAddSiteToBlockList().catch((error) => {
              // eslint-disable-next-line no-console
              console.error("Error adding site to block list:", error);
            });
          }}
        >
          🔒
        </Button>
      </div>
      {blockedSites?.length > 0 ? (
        <div className="flex flex-col flex-1 items-center w-full h-full overflow-auto">
          {blockedSites.map((site, idx) => {
            return (
              <div
                key={idx}
                className={
                  "flex items-center justify-center w-full p-2 border-b-2 border-[#1a1a1a]"
                }
              >
                <div className="truncate">{site.hostname}</div>
                <Button
                  title={t("app_button_unblock")}
                  onClick={() => {
                    handleRemoveSiteFromBlockList(site).catch((error) => {
                      // eslint-disable-next-line no-console
                      console.error(
                        "Error removing site from block list:",
                        error,
                      );
                    });
                  }}
                >
                  🔓
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center w-full h-full text-center leading-loose whitespace-pre-line">
          {t("app_list_empty")}
        </div>
      )}

      <WeekdayPicker
        selectedDays={settings.blockedDays || []}
        onChange={(days) => {
          handleDaysChange(days).catch((error) => {
            // eslint-disable-next-line no-console
            console.error("Error changing days:", error);
          });
        }}
      />

      <div className="flex">
        <TimePicker
          value={utcToLocalTime(settings.timeFrom) || ""}
          onChange={(e) => {
            handleSetTimeFrom(localToUTCTime(e.target.value)).catch((error) => {
              // eslint-disable-next-line no-console
              console.error("Error changing time from:", error);
            });
          }}
        />
        <TimePicker
          value={utcToLocalTime(settings.timeTo) || ""}
          onChange={(e) => {
            handleSetTimeTo(localToUTCTime(e.target.value)).catch((error) => {
              // eslint-disable-next-line no-console
              console.error("Error changing time to:", error);
            });
          }}
        />
      </div>

      <footer className="flex flex-row items-center w-full">
        <div className="flex-[45%]">
          <LanguageSwitcher
            onChange={(langCode) => {
              handleChangeLang(langCode).catch((error) => {
                // eslint-disable-next-line no-console
                console.error("Error changing language:", error);
              });
            }}
          />
        </div>
        <div className="flex-[55%]">
          <a
            href="https://github.com/Romander/FocusGuardian"
            target="_blank"
            rel="noreferrer"
          >
            <img src={githubIcon} alt="GitHub" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export { App };
