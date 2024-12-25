import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  addSiteToBlockListType,
  deleteSiteFromBlockListType,
  updateSettingsType,
} from "../../constants";
import { getSettingsFromStorage } from "../../services/settingsStorageService";
import { getSitesFromStorage } from "../../services/siteStorageService";
import {
  AddMessage,
  BlockedSite,
  DeleteMessage,
  Settings,
  SettingsChangeMessage,
} from "../../types";
import { LangType } from "../../types/lang";
import { getHostnameFromUrl } from "../../utils";
import {
  getAdjustedIntervalDuration,
  getCurrentTimeInUTC,
  isWithinTimeRange,
} from "../../utils/timeUtils";

const Overlay = () => {
  const { t, i18n } = useTranslation();

  const quotes = useMemo(
    () =>
      t("quotes", { returnObjects: true }) as {
        source: string;
        text: string;
      }[],
    [t],
  );

  const [quote, setQuote] = useState<{
    source: string;
    text: string;
  } | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    blockedDays: [],
    timeTo: "",
    timeFrom: "",
    langCode: i18n.language as LangType,
  });
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);

  useEffect(() => {
    const onMessage = (
      message: AddMessage | DeleteMessage | SettingsChangeMessage,
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
              (x) => x.hostname !== (message as DeleteMessage).site.hostname,
            );
          });

          if (
            !blockedSites
              .filter(
                (x) => x.hostname !== (message as DeleteMessage).site.hostname,
              )
              .some(
                (x) => x.hostname === new URL(location?.href || "").hostname,
              )
          ) {
            setShowOverlay(false);
          }

          break;
        case updateSettingsType: {
          const newSettings = (message as SettingsChangeMessage).value;

          setSettings((prev) => ({
            ...prev,
            ...newSettings,
          }));

          if (newSettings.langCode) {
            i18n.changeLanguage(newSettings.langCode).catch((error) => {
              // eslint-disable-next-line no-console
              console.error("Error changing language:", error);
            });
          }

          break;
        }
        default:
          break;
      }
    };

    chrome.runtime.onMessage.addListener(onMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, []);

  useEffect(() => {
    getSitesFromStorage(setBlockedSites);
    getSettingsFromStorage(setSettings);
  }, []);

  useEffect(() => {
    const today = new Date().getDay().toString();
    const isTodayBlocked = settings.blockedDays?.includes(today);
    const siteIsBlocked = blockedSites.some(
      (x) => x.hostname === getHostnameFromUrl(location.href),
    );

    // Check if both conditions - day and time - are met
    setShowOverlay(
      siteIsBlocked &&
        isTodayBlocked &&
        isWithinTimeRange(
          getCurrentTimeInUTC(),
          settings.timeFrom,
          settings.timeTo,
        ),
    );
  }, [blockedSites, settings]);

  useEffect(() => {
    if (showOverlay) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showOverlay]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, [quotes]);

  useEffect(() => {
    const checkOverlay = () => {
      if (
        !isWithinTimeRange(
          getCurrentTimeInUTC(),
          settings.timeFrom,
          settings.timeTo,
        )
      ) {
        setShowOverlay(false);
      }
    };

    // When the tab regains focus or becomes visible, check overlay visibility immediately
    const handleTabChange = () => {
      if (!document.hidden) {
        checkOverlay();
      }
    };

    window.addEventListener("focus", handleTabChange);
    window.addEventListener("visibilitychange", handleTabChange);

    const intervalDuration = getAdjustedIntervalDuration(
      document.hidden,
      getCurrentTimeInUTC(),
      settings.timeFrom,
      settings.timeTo,
    );
    const intervalId = setInterval(checkOverlay, intervalDuration);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleTabChange);
      window.removeEventListener("visibilitychange", handleTabChange);
    };
  }, [settings.timeFrom, settings.timeTo]);

  if (!showOverlay) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] box-border flex items-center justify-center bg-[#1a1a1a]">
      <div className="z-10 text-4xl text-honeydew font-serif text-white text-center">
        {quote && (
          <div className="mt-4">
            <p className="italic">{quote.text}</p>
            <p className="mt-2 text-xl">- {quote.source}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { Overlay };
