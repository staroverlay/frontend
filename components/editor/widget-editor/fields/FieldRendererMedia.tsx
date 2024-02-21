import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import MediaSelectModal from '@/components/modals/media-select-modal/MediaSelectModal';
import useMedia from '@/hooks/useMedia';
import { FileType } from '@/lib/interfaces/media';
import ITemplateField from '@/lib/interfaces/templates/template-field';
import { getMediaThumbnailURL } from '@/lib/utils/media';

export interface FieldRendererMediaProps {
  field: ITemplateField;
  value: unknown;
  setValue: (value: unknown) => void;
  filter?: FileType | FileType[];
}

export default function FieldRendererMedia({
  field,
  value,
  setValue,
  filter,
}: FieldRendererMediaProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { getMedia, medias } = useMedia();

  const media = value ? getMedia(value as string) : null;
  const thumbnail = media ? getMediaThumbnailURL(media) : null;

  return (
    <FormControl>
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

      <FormLabel>{field.label}</FormLabel>

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

      <FormHelperText>{field.description}</FormHelperText>
    </FormControl>
  );
}
