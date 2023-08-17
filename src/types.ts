import {
  addSiteToBlockListType,
  deleteSiteFromBlockListType,
  disableAllType,
} from "./constants";

export type RequestChromeContentListener = {
  message: "show_overlay" | undefined;
};

type MessageType =
  | typeof addSiteToBlockListType
  | typeof deleteSiteFromBlockListType
  | typeof disableAllType;

export type BlockedSite = { url: string; hostname: string; tabId: number };

export type Settings = { disableAll: boolean };

export type AddMessage = {
  type: MessageType;
  site: BlockedSite;
};

export type DeleteMessage = {
  type: MessageType;
  site: BlockedSite;
};

export type DisableAllChangeMessage = {
  type: MessageType;
  value: boolean;
};
