import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import useMedia from '@/hooks/useMedia';
import { getMediaThumbnailURL } from '@/lib/utils/media';
import { FileType } from '@/services/medias/media';

import MediaSelectModal from '../modals/media-select-modal/MediaSelectModal';

export interface MediaInputProps {
  value: string | null | undefined;
  setValue: (value: string) => unknown;
  filter?: FileType | FileType[];
}

export default function MediaInput({
  value,
  setValue,
  filter,
}: MediaInputProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { getMedia, medias } = useMedia();

  const media = value ? getMedia(value) : null;
  const thumbnail = media ? getMediaThumbnailURL(media) : null;

  return (
    <>
      <MediaSelectModal
        isOpen={isOpen}
        onClose={onClose}
        onSelect={(media) => {
          setValue(media._id);
          onClose();
        }}
        medias={medias}
        filter={filter}
      />
      <Flex
        bg={'Background'}
        borderRadius={'7px'}
        cursor={'pointer'}
        gap={'10px'}
        padding={'5px'}
        transition={'all 90ms ease-in-out'}
        onClick={onOpen}
        _hover={{
          transform: 'scale(1.05)',
        }}
      >
        {thumbnail == null && <Button size={'sm'}>Select media</Button>}
        {thumbnail != null && (
          <>
            <Image
              alt="Selected media"
              src={`${thumbnail}`}
              height={'100%'}
              maxWidth={'40px'}
            />

            <Box>
              <Text fontWeight={'bold'} fontSize={'14px'}>
                {media?.name}
              </Text>
              <Badge variant={'outline'} colorScheme={'pink'} mr={'5px'}>
                {((media?.size || 0) / 1024 / 1024).toFixed(2)} MB
              </Badge>
              <Badge variant={'outline'} colorScheme={'blue'} mr={'5px'}>
                {media?.type}
              </Badge>
            </Box>
          </>
        )}
      </Flex>
    </>
  );
}
