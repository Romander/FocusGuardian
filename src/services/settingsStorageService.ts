import { Settings } from "../types";

export const getSettingsFromStorage = (
  success: (settings: Settings) => void,
): void => {
  chrome.storage.sync.get(["settings"], (result) => {
    success((result.settings as Settings) || {});
  });
};

export const updateSettingsInStorage = (
  updateSettings: Partial<Settings>,
  success: (settings: Settings) => void,
): void => {
  chrome.storage.sync.get(["settings"], (result) => {
    const settings: Settings = {
      ...result.settings,
      ...updateSettings,
    } as Settings;

    chrome.storage.sync.set({ settings }, () => {
      success(settings);
    });
  });
};
