import R2 from '../clients/r2';
import client from '../graphql/client';
import CompleteMediaMutation from '../graphql/mutations/completeMediaMutation';
import CreateMediaMutation from '../graphql/mutations/createMediaMutation';
import DeleteMediaMutation from '../graphql/mutations/deleteMediaMutation';
import GetAllMediaQuery from '../graphql/queries/getAllMediaQuery';
import IMedia from '../interfaces/media';
import IMediaPart from '../interfaces/media-part';

export async function createMedia(payload: {
  contentType: string;
  name: string;
  size: number;
}) {
  const media = await client.fetch(CreateMediaMutation, { payload });
  return media as IMedia;
}

export async function uploadPart(
  id: string,
  uploadId: string,
  part: number,
  partBuffer: ArrayBuffer,
) {
  const buffer = Buffer.from(partBuffer).toString('binary');
  const payload = { uploadId, part, buffer };
  const { data } = await R2.put(`/${id}`, payload);
  return data as IMediaPart;
}

export async function completeMedia(payload: {
  id: string;
  parts: IMediaPart[];
  thumbnailParts: IMediaPart[];
}) {
  const media = await client.fetch(CompleteMediaMutation, { payload });
  return media as IMedia;
}

export async function getAllMedia() {
  const medias = await client.fetch(GetAllMediaQuery);
  return medias as IMedia[];
}

export async function deleteMedia(media: IMedia) {
  const id = media._id;
  return await client.fetch(DeleteMediaMutation, { id });
}
