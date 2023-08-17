import { Settings } from "../types";

export const getSettingsFromStorage = (
  success: (settings: Settings) => void
): void => {
  chrome.storage.sync.get(["settings"], (result) => {
    success(result.settings || {});
  });
};

export const updateSettingsInStorage = (
  updateSettings: Settings,
  success: (settings: Settings) => void
): void => {
  chrome.storage.sync.get(["settings"], (result) => {
    const settings: Settings = result.settings || {};

    settings.disableAll = updateSettings.disableAll;

    chrome.storage.sync.set({ settings }, () => {
      success(settings);
    });
  });
};
