import imageCompression from 'browser-image-compression';

import IMedia from '../interfaces/media';

const MAX_COVER_LENGTH = 0.256; // 256KB

export function getMediaURL(media: IMedia) {
  const worker = process.env['NEXT_PUBLIC_R2_WORKER'];
  const url = `${worker}${media.resourceId}`;
  return url;
}

export function getMediaThumbnailURL(media: IMedia) {
  const worker = process.env['NEXT_PUBLIC_R2_WORKER'];
  const url = `${worker}${media.resourceId}/thumbnail`;
  return url;
}

export function getVideoCover(file: File, seekTo = 0.0): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // create a blob url from a file
    const url = URL.createObjectURL(file);

    // load the file to a video player
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', url);
    videoPlayer.crossOrigin = 'anonymous';
    videoPlayer.load();
    videoPlayer.addEventListener('error', (e) => {
      reject('error when loading video file: ' + e.message);
    });

    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        reject('video is too short.');
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement('canvas');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          // return the canvas image as a BLOB
          ctx.canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject('error when getting video thumbnail blob');
              }
            },
            'image/jpeg',
            0.75 /* quality */,
          );
        }
      });
    });
  });
}

export async function getAudioThumbnail(file: File): Promise<Blob> {
  const WaveSurfer = (await import('wavesurfer.js')).default;

  const container = document.createElement('div');
  container.style.width = '300px';
  container.style.height = '250px';
  container.style.position = 'absolute';
  container.style.opacity = '0';
  container.style.filter = 'blur(10px)';
  document.body.appendChild(container);

  const wavesurfer = WaveSurfer.create({
    container,
    backgroundColor: 'transparent',
    waveColor: '#A770EF',
    barWidth: 3,
    barHeight: 1,
    height: 250,
    normalize: true,
    responsive: true,
    barRadius: 3,
    closeAudioContext: true,
  });

  wavesurfer.loadBlob(file);

  return new Promise((resolve) => {
    wavesurfer.on('ready', () => {
      setTimeout(async () => {
        const data: Blob[] = (await wavesurfer.exportImage(
          'image/jpeg',
          0.75,
          'blob',
        )) as Blob[];
        container.remove();
        resolve(data[0]);
      }, 800);
    });
  });
}

export async function getImageThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          ctx.canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              }
            },
            'image/jpeg',
            0.75,
          );
        }
      };
    };
    reader.readAsDataURL(file);
  });
}

async function compressImage(blob: Blob, maxLength: number): Promise<Blob> {
  // Convert blob to file.
  const file = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });

  // Compress image.
  const options = {
    maxSizeMB: maxLength,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}

export async function generateMediaThumbnail(file: File): Promise<Blob> {
  const type = file.type.split('/')[0];
  let thumbnail = null;

  switch (type) {
    case 'video':
      thumbnail = await getVideoCover(file);
      break;
    case 'audio':
      thumbnail = await getAudioThumbnail(file);
      break;
    case 'image':
      thumbnail = await getImageThumbnail(file);
      break;
    default:
      throw new Error('Unsupported media type');
  }

  return compressImage(thumbnail, MAX_COVER_LENGTH);
}
