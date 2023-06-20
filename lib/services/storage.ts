import R2 from "../clients/r2";
import client from "../graphql/client";
import CompleteMediaMutation from "../graphql/mutations/completeMediaMutation";
import CreateMediaMutation from "../graphql/mutations/createMediaMutation";

import IMedia from "../interfaces/media";
import IMediaPart from "../interfaces/mediapart";
import { readFileAsArrayBuffer } from "../utils/files";

export async function createMedia(
  contentType: string,
  name: string,
  size: number
) {
  const media = await client.fetch(CreateMediaMutation, {
    payload: { contentType, name, size },
  });
  return media as IMedia;
}

export async function uploadPart(
  id: string,
  uploadId: string,
  part: number,
  partBuffer: ArrayBuffer
) {
  const buffer = Buffer.from(partBuffer).toString("binary");
  const payload = { uploadId, part, buffer };
  const { data } = await R2.put(`/${id}`, payload);
  return data as IMediaPart;
}

export async function completeMedia(id: string, parts: IMediaPart[]) {
  const media = await client.fetch(CompleteMediaMutation, {
    payload: { id, parts },
  });
  return media as IMedia;
}

export function splitBufferInChunks(
  buffer: ArrayBuffer,
  maxChunkSize: number
): ArrayBuffer[] {
  const chunks: ArrayBuffer[] = [];

  let cursor = 0;
  let bytesLeft = buffer.byteLength;

  while (bytesLeft > 0) {
    const chunkSize = Math.min(bytesLeft, maxChunkSize);
    const chunkDelimiter = cursor + chunkSize;
    const chunk = buffer.slice(cursor, chunkDelimiter);
    chunks.push(chunk);

    cursor = chunkDelimiter;
    bytesLeft -= chunkSize;
  }

  return chunks;
}

export async function uploadFile(file: File) {
  const media = await createMedia(file.type, file.name, file.size);
  const buffer = await readFileAsArrayBuffer(file);
  const chunks = splitBufferInChunks(buffer, 5 * 1024 * 1024);
  const parts: IMediaPart[] = [];

  const id = media.resourceId;
  const uploadId = media.uploadId as string;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const part = await uploadPart(id, uploadId, i + 1, chunk);
    parts.push(part);
  }

  await completeMedia(media._id, parts);
}
