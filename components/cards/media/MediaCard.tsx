import {
  Card,
  IconButton,
  Flex,
  CardBody,
  Tag,
  Badge,
  CardFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiTrash, FiEdit, FiDownload } from "react-icons/fi";
import useMedia from "../../../hooks/useMedia";

import IMedia from "../../../lib/interfaces/media";
import { deleteMedia } from "../../../lib/services/media";
import { downloadURL } from "../../../lib/utils/files";
import { getMediaThumbnail, getMediaURL } from "../../../lib/utils/media";
import { toastPending } from "../../../lib/utils/toasts";
import ConfirmationAlert from "../../alerts/confirmation/ConfirmationAlert";
import MediaPreviewModal from "../../modals/media-preview-modal/MediaPreviewModal";

import styles from "./MediaCard.module.css";

interface MediaCardProps {
  media: IMedia;
}

function DeleteButton({ media }: MediaCardProps) {
  const { removeMedia } = useMedia();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await deleteMedia(media);
    if (!result) throw new Error("Failed to delete media");
    onClose();
    removeMedia(media);
  };

  return (
    <>
      <ConfirmationAlert
        isOpen={isOpen}
        onClose={onClose}
        onAccept={async () => {
          setIsDeleting(true);
          await toastPending(handleDelete, {
            pending: "Deleting media",
            success: "Media deleted",
          });
          setIsDeleting(false);
        }}
        isLoading={isDeleting}
        title={`Delete ${media.name}?`}
      >
        This action can not be undone. Make sure you have a backup in case you
        need this resource in the future.
      </ConfirmationAlert>

      <IconButton
        aria-label="Delete"
        colorScheme={"red"}
        icon={<FiTrash />}
        onClick={onOpen}
      />
    </>
  );
}

function DownloadButton({ media }: MediaCardProps) {
  const url = getMediaURL(media);

  const handleDownload = () => {
    downloadURL(url, media.name);
  };

  return (
    <>
      <IconButton
        aria-label="Edit"
        colorScheme={"cyan"}
        icon={<FiDownload />}
        onClick={handleDownload}
      />
    </>
  );
}

function EditButton({ media }: MediaCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton aria-label="Edit" colorScheme={"green"} icon={<FiEdit />} />
    </>
  );
}

export default function MediaCard({ media }: MediaCardProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (media) {
      getMediaThumbnail(media).then(setThumbnail);
    }
  }, [media]);

  return (
    <div
      style={{ backgroundImage: `url(${thumbnail})` }}
      className={styles.container}
    >
      <MediaPreviewModal isOpen={isOpen} onClose={onClose} media={media} />

      <Card
        backgroundColor={"transparent"}
        backgroundImage={`url(${thumbnail})`}
        className={styles.card}
      >
        <CardBody padding={"10px"} onClick={onOpen}>
          <Flex justifyContent={"space-between"} width={"100%"}>
            <Tag variant={"solid"}>{media.name}</Tag>

            <Badge variant={"solid"} colorScheme={"pink"}>
              {(media.size / 1024 / 1024).toFixed(2)} MB
            </Badge>
          </Flex>
        </CardBody>

        <CardFooter className={styles.footer}>
          <Flex gap={"4px"}>
            <EditButton media={media} />
            <DownloadButton media={media} />
            <DeleteButton media={media} />
          </Flex>
        </CardFooter>
      </Card>
    </div>
  );
}
