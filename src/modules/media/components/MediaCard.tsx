import { Media } from '@staroverlay/sdk';
import { Film, Music } from 'lucide-react';

import { bytesToSize } from '@/shared/utils/fileUtils';

interface MediaCardProps {
  media: Media;
  onClick?: (media: Media) => unknown;
}

export default function MediaCard({ media, onClick }: MediaCardProps) {
  return (
    <div
      key={media._id}
      onClick={() => onClick && onClick(media)}
      className="glass-card rounded-lg overflow-hidden cursor-pointer group"
    >
      <div className="relative aspect-video bg-black">
        {media.type === 'image' && (
          <img
            src={media._id}
            alt={media.name}
            className="w-full h-full object-cover"
          />
        )}
        {media.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-8 w-8 text-gray-400" />
          </div>
        )}
        {media.type === 'audio' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-200 truncate">
          {media.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{bytesToSize(media.size)}</p>
      </div>
    </div>
  );
}
