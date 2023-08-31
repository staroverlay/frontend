import IMedia from "../../lib/interfaces/media";

export interface MediaHook {
  medias: IMedia[];
  addMedia: (media: IMedia) => void;
  updateMedia: (media: IMedia) => void;
  removeMedia: (media: IMedia | string) => void;
  storageUsage: number;

  isUploadModalOpen: boolean;
  openUploadModal: () => void;
}
