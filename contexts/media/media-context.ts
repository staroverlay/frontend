import React from 'react';

import IMedia from '@/lib/interfaces/media';

import { MediaHook } from './media-hook';

export const MediaContext = React.createContext<MediaHook>({
  medias: [],
  removeMedia: (media: IMedia | string): void => {},
  addMedia: (media: IMedia): void => {},
  updateMedia: (media: IMedia): void => {},
  getMedia: (id: string): IMedia | undefined => undefined,
  storageUsage: 0,
  isUploadModalOpen: false,
  openUploadModal: (): void => {},
});
