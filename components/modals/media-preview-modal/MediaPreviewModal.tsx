import IMedia from '../../../lib/interfaces/media';
import FilePreview from '../../content/file-preview/FilePreview';
import BaseModal from '../base-modal/BaseModal';

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: IMedia;
}

export default function MediaPreviewModal({
  isOpen,
  onClose,
  media,
}: MediaPreviewModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Previewing ${media.name}`}
    >
      <FilePreview media={media} />
    </BaseModal>
  );
}
