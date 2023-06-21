import { Flex } from "@chakra-ui/react";
import IMedia from "../../../lib/interfaces/media";
import { getMediaURL } from "../../../lib/utils/media";

import styles from "./FilePreview.module.css";

interface InternalFilePreviewProps {
  uri: string;
}

function ImageFilePreview({ uri }: InternalFilePreviewProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.image} src={uri} alt={"Image Preview"} />;
}

function VideoFilePreview({ uri }: InternalFilePreviewProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <video autoPlay controls loop className={styles.video} src={uri} />;
}

function AudioFilePreview({ uri }: InternalFilePreviewProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <audio autoPlay controls loop className={styles.video} src={uri} />;
}

interface FilePreviewProps {
  file: File;
}

export default function FilePreview({ file }: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isAudio = file.type.startsWith("audio/");
  const url = URL.createObjectURL(file);

  return (
    <Flex className={styles.container}>
      {isImage && <ImageFilePreview uri={url} />}
      {isVideo && <VideoFilePreview uri={url} />}
      {isAudio && <AudioFilePreview uri={url} />}
    </Flex>
  );
}
