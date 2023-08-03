import IMediaPart from "../interfaces/media-part";
import {
  completeMedia,
  createMedia,
  uploadPart,
} from "../services/media-service";
import { readFileAsArrayBuffer } from "./files";

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

export async function uploadFile(file: File, name?: string) {
  const media = await createMedia({
    contentType: file.type,
    name: name || file.name,
    size: file.size,
  });
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

  return await completeMedia({ id: media._id, parts });
}
