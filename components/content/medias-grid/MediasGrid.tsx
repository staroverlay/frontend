import MediaCard from "@/components/cards/media/MediaCard";
import useMedia from "@/hooks/useMedia";
import IMedia, { FileType } from "@/lib/interfaces/media";
import { Button, Flex, Heading, SimpleGrid } from "@chakra-ui/react";

interface MediasGridProps {
  medias: IMedia[];
  cardSize?: "sm" | "md" | "lg";
  filter?: FileType | FileType[];
  onSelect?: (media: IMedia) => void;
}

function UploadContentButton() {
  const { openUploadModal } = useMedia();
  return <Button onClick={openUploadModal}>Upload content</Button>;
}

export default function MediasGrid(props: MediasGridProps) {
  const rawFilter = props.filter || ["audio", "image", "video"];
  const filter = Array.isArray(rawFilter) ? rawFilter : [rawFilter];
  const filtered = props.medias.filter((media) => filter.includes(media.type));
  const isEmpty = filtered.length === 0;

  return (
    <>
      <SimpleGrid
        gridTemplateColumns={"repeat(auto-fit, 300px)"}
        spacing="40px"
      >
        {filtered.map((media) => (
          <MediaCard
            key={media.resourceId}
            media={media}
            size={props.cardSize}
            onSelect={props.onSelect}
          />
        ))}
      </SimpleGrid>

      {isEmpty && (
        <Flex alignContent={"center"} justifyContent={"center"}>
          <Flex direction={"column"} alignContent={"center"} gap={"10px"}>
            <Heading>No media files</Heading>
            <UploadContentButton />
          </Flex>
        </Flex>
      )}
    </>
  );
}