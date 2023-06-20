export type FileType = "image" | "sound" | "video";

export default interface IMedia {
  _id: string;
  name: string;
  resourceId: string;
  size: number;
  type: FileType;
  uploadId?: string;
  userId: string;
}
