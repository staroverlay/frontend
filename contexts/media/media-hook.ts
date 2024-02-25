import IMedia from '@/lib/interfaces/media';

export interface MediaHook {
  medias: IMedia[];
  addMedia: (media: IMedia) => void;
  updateMedia: (media: IMedia) => void;
  removeMedia: (media: IMedia | string) => void;
  getMedia: (id: string) => IMedia | undefined;
  storageUsage: number;

  isUploadModalOpen: boolean;
  openUploadModal: () => void;
}
