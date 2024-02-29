import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  IconButton,
  Tag,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiDownload, FiEdit, FiTrash } from 'react-icons/fi';

import useMedia from '@/hooks/useMedia';
import { downloadURL } from '@/lib/utils/files';
import { getMediaThumbnailURL, getMediaURL } from '@/lib/utils/media';
import { toastPending } from '@/lib/utils/toasts';
import { deleteMedia } from '@/services/medias';
import IMedia from '@/services/medias/media';

import ConfirmationAlert from '../../alerts/confirmation/ConfirmationAlert';
import MediaPreviewModal from '../../modals/media-preview-modal/MediaPreviewModal';
import styles from './MediaCard.module.css';

interface MediaCardProps {
  media: IMedia;
  size?: 'lg' | 'md' | 'sm';
  onSelect?: (media: IMedia) => void;
}

function DeleteButton({ media, size }: MediaCardProps) {
  const { removeMedia } = useMedia();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await deleteMedia(media);
    if (!result) throw new Error('Failed to delete media');
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
            pending: 'Deleting media',
            success: 'Media deleted',
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
        colorScheme={'red'}
        icon={<FiTrash />}
        onClick={onOpen}
        size={size}
      />
    </>
  );
}

function DownloadButton({ media, size }: MediaCardProps) {
  const url = getMediaURL(media);

  const handleDownload = () => {
    downloadURL(url, media.name);
  };

  return (
    <>
      <IconButton
        aria-label="Edit"
        colorScheme={'cyan'}
        icon={<FiDownload />}
        onClick={handleDownload}
        size={size}
      />
    </>
  );
}

function EditButton({ media, size }: MediaCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Edit"
        colorScheme={'green'}
        icon={<FiEdit />}
        size={size}
      />
    </>
  );
}

export default function MediaCard({ media, size, onSelect }: MediaCardProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const thumbnail = getMediaThumbnailURL(media);

  return (
    <div className={styles[`card-${size || 'lg'}`]}>
      <div
        style={{ backgroundImage: `url(${thumbnail})` }}
        className={styles.container}
      >
        <MediaPreviewModal isOpen={isOpen} onClose={onClose} media={media} />

        <Card
          backgroundColor={'transparent'}
          backgroundImage={`url(${thumbnail})`}
          className={styles.card}
          onClick={() => {
            onSelect ? onSelect(media) : onOpen();
          }}
        >
          <CardBody padding={'10px'}>
            <Flex justifyContent={'space-between'} width={'100%'}>
              <Tag variant={'solid'}>{media.name}</Tag>

              <Badge variant={'solid'} colorScheme={'pink'}>
                {(media.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
            </Flex>
          </CardBody>

          <CardFooter className={styles.footer}>
            {onSelect && (
              <Button
                colorScheme={'purple'}
                size={'xs'}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
              >
                Preview
              </Button>
            )}

            {!onSelect && (
              <Flex gap={'4px'}>
                <EditButton media={media} size={size} />
                <DownloadButton media={media} size={size} />
                <DeleteButton media={media} size={size} />
              </Flex>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
