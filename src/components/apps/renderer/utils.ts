export const MEDIA_BASE = import.meta.env.VITE_UPLOAD_SERVER || 'http://localhost:8787';

export function parseMediaPath(path: any) {
    if (!path || typeof path !== 'string' || !path.startsWith('usercontent/')) return null;
    const parts = path.split('/');
    if (parts.length < 3) return null;
    const [_, userId, fileId] = parts;
    return {
        id: fileId,
        userId,
        url: `${MEDIA_BASE}/${path}`,
        thumbnailUrl: `${MEDIA_BASE}/${path}/thumbnail`
    };
}
