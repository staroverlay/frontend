export type FileType = 'image' | 'audio' | 'video';

export default interface IMedia {
  _id: string;
  name: string;
  size: number;
  type: FileType;
  uploadId?: string;
  thumbnailUploadId?: string;
  userId: string;
}
