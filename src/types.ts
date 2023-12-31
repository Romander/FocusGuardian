import {
  addSiteToBlockListType,
  deleteSiteFromBlockListType,
  updateSettingsType,
} from "./constants";
import { LangType } from "./types/lang";

export type RequestChromeContentListener = {
  message: "show_overlay" | undefined;
};

type MessageType =
  | typeof addSiteToBlockListType
  | typeof deleteSiteFromBlockListType
  | typeof updateSettingsType;

export type BlockedSite = { url: string; hostname: string; tabId: number };

export type Settings = {
  blockedDays: string[];
  timeTo: string;
  timeFrom: string;
  langCode: LangType;
};

export type AddMessage = {
  type: MessageType;
  site: BlockedSite;
};

export type DeleteMessage = {
  type: MessageType;
  site: BlockedSite;
};

export type SettingsChangeMessage = {
  type: MessageType;
  value: Settings;
};
