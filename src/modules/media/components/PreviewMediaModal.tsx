import Modal from '@/shared/components/Modal';
import { bytesToSize } from '@/shared/utils/fileUtils';
import { Media } from '@staroverlay/sdk';
import { Film, Music, Pencil, Trash2 } from 'lucide-react';

export interface PreviewMediaModalProps {
  media: Media | null | undefined;
  onClose: () => void;
}

export default function PreviewMediaModal({
  media,
  onClose,
}: PreviewMediaModalProps) {
  if (!media) return null;

  return (
    <Modal title="Media Preview" onClose={onClose}>
      <div className="p-6">
        <div className="aspect-video bg-black rounded-lg mb-4">
          {media.type === 'image' && (
            <img
              src={media._id}
              alt={media.name}
              className="w-full h-full object-contain"
            />
          )}
          {media.type === 'video' && (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="h-12 w-12 text-gray-400" />
            </div>
          )}
          {media.type === 'audio' && (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-200">{media.name}</h4>
            <p className="text-sm text-gray-400 mt-1">
              {bytesToSize(media.size)} • Uploaded on{' '}
              {new Date(media.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-purple-400 transition-colors">
              <Pencil className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
