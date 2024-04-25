import { completeMedia, createMedia, uploadPart } from '../../services/medias';
import IMediaPart from '../../services/medias/media-part';
import { readFileAsArrayBuffer } from './files';
import { generateMediaThumbnail } from './media';

export function splitBufferInChunks(
  buffer: ArrayBuffer,
  maxChunkSize: number,
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

export async function uploadFile(file: File, name?: string) {
  const media = await createMedia({
    contentType: file.type,
    name: name || file.name,
    size: file.size,
  });

  // Upload file.
  const buffer = await readFileAsArrayBuffer(file);
  const chunks = splitBufferInChunks(buffer, 5 * 1024 * 1024);
  const parts: IMediaPart[] = [];

  const id = media._id;
  const uploadId = media.uploadId as string;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const part = await uploadPart(id, uploadId, i + 1, chunk);
    parts.push(part);
  }

  // Upload thumbnail.
  const thumbnailUploadId = media.thumbnailUploadId as string;
  const thumbnailBlob = await generateMediaThumbnail(file);
  const thumbnailBuffer = await readFileAsArrayBuffer(thumbnailBlob);
  const thumbnailChunks = splitBufferInChunks(thumbnailBuffer, 1024 * 256);
  let thumbnailParts = [];

  if (thumbnailChunks.length == 1) {
    const thumbId = `${media._id}/thumbnail`;
    const part = await uploadPart(
      thumbId,
      thumbnailUploadId,
      1,
      thumbnailChunks[0],
    );
    thumbnailParts.push(part);
  }

  return await completeMedia({ id: media._id, parts, thumbnailParts });
}
