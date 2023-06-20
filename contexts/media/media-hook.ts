import IMedia from "../../lib/interfaces/media";

export interface MediaHook {
  medias: IMedia[];
  removeMedia: (media: IMedia | string) => void;
  addMedia: (media: IMedia) => void;
  updateMedia: (media: IMedia) => void;

  isUploadModalOpen: boolean;
  openUploadModal: () => void;
}
