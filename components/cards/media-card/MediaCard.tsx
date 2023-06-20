import { Card, CardBody } from "@chakra-ui/react";
import Image from "next/image";
import IMedia from "../../../lib/interfaces/media";

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

  return (
    <Card width={"300px"}>
      <CardBody>
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={"Thumbnail"}
            width={"300"}
            height={"250"}
          />
        )}
      </CardBody>
    </Card>
  );
}
