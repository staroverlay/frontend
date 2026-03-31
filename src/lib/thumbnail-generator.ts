/**
 * Utility to generate and compress thumbnails for different file types.
 */
export class ThumbnailGenerator {
    private static readonly MAX_SIZE_KB = 200;
    private static readonly MAX_SIZE_BYTES = ThumbnailGenerator.MAX_SIZE_KB * 1024;
    private static readonly THUMB_WIDTH = 512;
    private static readonly THUMB_HEIGHT = 512;

    /**
     * Generates a thumbnail for the given file.
     * @param file The source file (image, audio, or video)
     * @returns A Promise that resolves to a compressed JPEG Blob
     */
    static async generate(file: File): Promise<Blob> {
        let canvas: HTMLCanvasElement;

        if (file.type.startsWith('image/')) {
            canvas = await this.fromImage(file);
        } else if (file.type.startsWith('video/')) {
            canvas = await this.fromVideo(file);
        } else if (file.type.startsWith('audio/')) {
            canvas = await this.fromAudio(file);
        } else {
            throw new Error(`Unsupported file type for thumbnail: ${file.type}`);
        }

        return this.compressCanvas(canvas);
    }

    private static async fromImage(file: File): Promise<HTMLCanvasElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;

                // Calculate dimensions to fit in 512x512 while maintaining aspect ratio
                const ratio = Math.min(this.THUMB_WIDTH / img.width, this.THUMB_HEIGHT / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    private static async fromVideo(file: File): Promise<HTMLCanvasElement> {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;

            const cleanup = () => {
                URL.revokeObjectURL(video.src);
                video.remove();
            };

            video.onloadeddata = () => {
                // Seek to 0.1s to avoid potential black frame at 0
                video.currentTime = 0.1;
            };

            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;

                const ratio = Math.min(this.THUMB_WIDTH / video.videoWidth, this.THUMB_HEIGHT / video.videoHeight);
                canvas.width = video.videoWidth * ratio;
                canvas.height = video.videoHeight * ratio;

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                cleanup();
                resolve(canvas);
            };

            video.onerror = (e) => {
                cleanup();
                reject(e);
            };

            video.src = URL.createObjectURL(file);
        });
    }

    private static async fromAudio(file: File): Promise<HTMLCanvasElement> {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const canvas = document.createElement('canvas');
        canvas.width = this.THUMB_WIDTH;
        canvas.height = this.THUMB_HEIGHT;
        const ctx = canvas.getContext('2d')!;

        // Fill background
        ctx.fillStyle = '#09090b'; // zinc-950
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const data = audioBuffer.getChannelData(0);
        const bufferLength = data.length;
        const sliceWidth = canvas.width;
        const samplesPerSlice = Math.floor(bufferLength / sliceWidth);

        // Simple mock of intensities via energy calculation per slice
        for (let i = 0; i < sliceWidth; i++) {
            let sum = 0;
            for (let j = 0; j < samplesPerSlice; j++) {
                sum += Math.abs(data[i * samplesPerSlice + j]);
            }
            const intensity = sum / samplesPerSlice;
            const barHeight = intensity * canvas.height * 2.5;

            // Gradient for different 'frequencies' (simulated)
            const gradient = ctx.createLinearGradient(0, canvas.height / 2 - barHeight / 2, 0, canvas.height / 2 + barHeight / 2);
            gradient.addColorStop(0, '#f43f5e'); // rose-500
            gradient.addColorStop(0.5, '#8b5cf6'); // violet-500
            gradient.addColorStop(1, '#06b6d4'); // cyan-500

            ctx.fillStyle = gradient;
            ctx.fillRect(i, canvas.height / 2 - barHeight / 2, 1, barHeight);
        }

        // Add some noise/glow for that premium look
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(4px)';
        ctx.globalAlpha = 0.3;
        ctx.drawImage(canvas, 0, 0);
        ctx.globalAlpha = 1.0;
        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';

        await audioCtx.close();
        return canvas;
    }

    private static async compressCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
        let quality = 0.9;
        let blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality));

        // Iteratively reduce quality if still over 200kb
        while (blob.size > this.MAX_SIZE_BYTES && quality > 0.1) {
            quality -= 0.1;
            blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality));
        }

        return blob;
    }
}
