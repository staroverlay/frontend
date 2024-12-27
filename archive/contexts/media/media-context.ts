import { Media } from '@staroverlay/sdk';
import React from 'react';

import { MediaHook } from './media-hook';

export const MediaContext = React.createContext<MediaHook>({
  medias: [],
  removeMedia: (media: Media | string): void => {},
  addMedia: (media: Media): void => {},
  updateMedia: (media: Media): void => {},
  getMedia: (id: string): Media | undefined => undefined,
  storageUsage: 0,
  isUploadModalOpen: false,
  openUploadModal: (): void => {},
});
