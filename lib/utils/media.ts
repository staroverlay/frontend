import IMedia from "../interfaces/media";

export function getMediaURL(media: IMedia) {
  const worker = process.env["NEXT_PUBLIC_R2_WORKER"];
  const url = `${worker}${media.resourceId}`;
  return url;
}

export function getVideoCover(
  media: IMedia,
  seekTo = 0.0
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const url = getMediaURL(media);
    if (!url) return reject("no video url found.");

    // load the file to a video player
    const videoPlayer = document.createElement("video");
    videoPlayer.setAttribute("src", url);
    videoPlayer.crossOrigin = "anonymous";
    videoPlayer.load();
    videoPlayer.addEventListener("error", (e) => {
      reject("error when loading video file: " + e.message);
    });

    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener("loadedmetadata", () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener("seeked", () => {
        console.log("video is now paused at %ss.", seekTo);
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          // return the canvas image as a BLOB
          ctx.canvas.toBlob(
            (blob) => {
              if (blob) {
                const uri = URL.createObjectURL(blob);
                resolve(uri);
              } else {
                reject("error when getting video thumbnail blob");
              }
            },
            "image/jpeg",
            0.75 /* quality */
          );
        }
      });
    });
  });
}

export async function getMediaThumbnail(media: IMedia): Promise<string | null> {
  if (media.type == "image") {
    return getMediaURL(media);
  } else if (media.type == "video") {
    return await getVideoCover(media);
  } else {
    return "";
  }
}
