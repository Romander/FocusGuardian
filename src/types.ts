import { addSiteToBlockListType, deleteSiteFromBlockListType } from './constants';

export type RequestChromeContentListener = {
  message: 'show_overlay' | undefined;
};

type MessageType = typeof addSiteToBlockListType | typeof deleteSiteFromBlockListType;

export type AddMessage = {
  type: MessageType;
  url: string;
};

export type DeleteMessage = {
  type: MessageType;
  site: string;
};
