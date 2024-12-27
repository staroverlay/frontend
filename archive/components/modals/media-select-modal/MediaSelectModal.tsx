import { FileType, Media } from '@staroverlay/sdk';

import MediasGrid from '@/components/content/medias-grid/MediasGrid';

import BaseModal from '../base-modal/BaseModal';

interface MediaSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  medias: Media[];
  filter?: FileType | FileType[];
}

export default function MediaSelectModal({
  isOpen,
  onClose,
  onSelect,
  medias,
  filter,
}: MediaSelectModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size={'4xl'}
      title={`Select a media file`}
    >
      <MediasGrid
        cardSize="sm"
        medias={medias}
        filter={filter}
        onSelect={onSelect}
      />
    </BaseModal>
  );
}
