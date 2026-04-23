import api from '../lib/api-client';
import { ThumbnailGenerator } from '../lib/thumbnail-generator';

const UPLOAD_SERVER = import.meta.env.VITE_UPLOAD_SERVER || 'http://localhost:8787';

export const uploadsService = {
    async getQuota() {
        const { data } = await api.get('/uploads/quota');
        return data;
    },

    async listUploads() {
        const { data } = await api.get('/uploads');
        return data;
    },

    async deleteUpload(id: string) {
        const { data } = await api.delete(`/uploads/${id}`);
        return data;
    },

    async uploadFile(file: File, onProgress: (progress: number) => void) {
        const initiateRes = await api.post('/uploads/initiate', {
            displayName: file.name.split('.').slice(0, -1).join('.') || file.name,
            mimeType: file.type || 'application/octet-stream',
            sizeBytes: file.size,
        });

        if (!initiateRes.data.success) throw new Error("Failed to initiate upload");
        const { upload, uploadId, key, fileId, thumbnailToken } = initiateRes.data;

        // Generate and upload thumbnail in background (don't block main upload but it's small)
        try {
            const thumbBlob = await ThumbnailGenerator.generate(file);
            await fetch(`${UPLOAD_SERVER}/thumbnail`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${thumbnailToken}`,
                    'Content-Type': 'image/jpeg'
                },
                body: thumbBlob
            });
        } catch (e) {
            console.error("Optional thumbnail upload failed", e);
        }

        try {
            const chunkSize = 5 * 1024 * 1024;
            const totalParts = Math.ceil(file.size / chunkSize);
            const uploadedParts = [];
            let uploadedBytes = 0;

            for (let i = 0; i < totalParts; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);

                const partNumber = i + 1;

                // Call worker directly with uploadId and key (enc) in query params
                const req = await fetch(`${UPLOAD_SERVER}/upload/part?uploadId=${uploadId}&key=${encodeURIComponent(key)}&partNumber=${partNumber}`, {
                    method: 'PUT',
                    body: chunk
                });

                if (!req.ok) {
                    const err = await req.text();
                    throw new Error(`Failed to upload part ${partNumber}: ${err}`);
                }

                const { etag } = await req.json();
                uploadedParts.push({ partNumber, etag });

                uploadedBytes += chunk.size;
                onProgress((uploadedBytes / file.size) * 100);
            }

            const completeRes = await api.post('/uploads/complete', {
                uploadId: upload.id,
                session: { fileId, uploadId, key, uploadedParts }
            });

            return completeRes.data;
        } catch (e) {
            if (upload?.id) {
                await api.post('/uploads/abort', {
                    uploadId: upload.id,
                    r2UploadId: uploadId || ''
                }).catch(() => { });
            }
            throw e;
        }
    }
}
