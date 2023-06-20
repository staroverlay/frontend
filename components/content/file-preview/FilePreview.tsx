import { Flex } from "@chakra-ui/react";

import styles from "./FilePreview.module.css";

interface InternalFilePreviewProps {
  uri: string;
}

function ImageFilePreview({ uri }: InternalFilePreviewProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.image} src={uri} alt={"Image Preview"} />;
}

interface FilePreviewProps {
  file: File;
}

export default function FilePreview({ file }: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isAudio = file.type.startsWith("audio/");

  return (
    <Flex className={styles.container}>
      {isImage && <ImageFilePreview uri={URL.createObjectURL(file)} />}
    </Flex>
  );
}
