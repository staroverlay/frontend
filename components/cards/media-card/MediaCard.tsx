import {
  Card,
  Box,
  Flex,
  CardBody,
  Tag,
  Badge,
  CardFooter,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import IMedia from "../../../lib/interfaces/media";

import styles from "./MediaCard.module.css";

interface MediaCardProps {
  media: IMedia;
}

function getMediaThumbnail(media: IMedia) {
  if (media.type == "image") {
    const worker = process.env["NEXT_PUBLIC_R2_WORKER"];
    const url = `${worker}${media.resourceId}`;
    return url;
  }

  return null;
}

export default function MediaCard({ media }: MediaCardProps) {
  const thumbnail = getMediaThumbnail(media);
  const [hover, setHover] = useState(false);
  const cardRef = useRef();

  useEffect(() => {}, [cardRef]);

  return (
    <Card
      backgroundImage={`url(${thumbnail})`}
      className={styles.card}
      ref={cardRef}
    >
      <CardBody>
        <Flex justifyContent={"space-between"} width={"100%"}>
          <Tag variant={"solid"}>{media.name}</Tag>

          <Badge>{(media.size / 1024).toFixed(2)} KB</Badge>
        </Flex>
      </CardBody>

      <CardFooter>adsad</CardFooter>
    </Card>
  );
}
