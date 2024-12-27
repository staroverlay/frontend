import { Media } from '@staroverlay/sdk';

export interface MediaHook {
  medias: Media[];
  addMedia: (media: Media) => void;
  updateMedia: (media: Media) => void;
  removeMedia: (media: Media | string) => void;
  getMedia: (id: string) => Media | undefined;
  storageUsage: number;

  isUploadModalOpen: boolean;
  openUploadModal: () => void;
}
