import IMedia from "../interfaces/media";

export function getMediaThumbnail(media: IMedia) {
  if (media.type == "image") {
    const worker = process.env["NEXT_PUBLIC_R2_WORKER"];
    const url = `${worker}${media.resourceId}`;
    return url;
  }

  return null;
}
