import React from "react";

import { MediaHook } from "./media-hook";

import IMedia from "../../lib/interfaces/media";

export const MediaContext = React.createContext<MediaHook>({
  medias: [],
  removeMedia: (media: IMedia | string): void => {},
  addMedia: (media: IMedia): void => {},
  updateMedia: (media: IMedia): void => {},
  storageUsage: 0,
  isUploadModalOpen: false,
  openUploadModal: (): void => {},
});
