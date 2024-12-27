import { HardDrive, Search, Upload } from 'lucide-react';
import { useState } from 'react';

import MediaCard from '@/media/components/MediaCard';
import PreviewMediaModal from '@/media/components/PreviewMediaModal';
import UploadMediaModal from '@/media/components/UploadMediaModal';
import Container from '@/shared/components/Container';
import ProgressBar from '@/shared/components/ProgressBar';
import { Tab, Tabs } from '@/shared/components/Tabs';
import useDisclosure from '@/shared/hooks/useDisclosure';
import { bytesToSize } from '@/shared/utils/fileUtils';
import { Media } from '@staroverlay/sdk';

const STORAGE_LIMIT = 50 * 1024 * 1024; // 50MB in bytes
const STORAGE_USED = 30 * 1024 * 1024; // 30MB in bytes

const mockMedia: (Media & { createdAt: string })[] = [
  {
    _id: '1',
    name: 'stream-overlay.png',
    type: 'image',
    size: 2.5 * 1024 * 1024,
    userId: 'user1',
    createdAt: '2022-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    name: 'intro-video.mp4',
    type: 'video',
    size: 15 * 1024 * 1024,
    userId: 'user1',
    createdAt: '2022-01-01T00:00:00.000Z',
  },
  {
    _id: '3',
    name: 'alert-sound.mp3',
    type: 'audio',
    size: 500 * 1024,
    userId: 'user1',
    createdAt: '2022-01-01T00:00:00.000Z',
  },
];

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const uploadModal = useDisclosure();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const tabs: Tab[] = [
    { id: 'all', label: 'All Files', icon: 'HardDrive' },
    { id: 'image', label: 'Images', icon: 'ImageIcon' },
    { id: 'video', label: 'Videos', icon: 'Film' },
    { id: 'audio', label: 'Audio', icon: 'Music' },
  ];

  const filteredMedia = mockMedia
    .filter((item) => {
      if (activeTab === 'all') return true;
      return item.type === activeTab;
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const storagePercentage = (STORAGE_USED / STORAGE_LIMIT) * 100;

  return (
    <div className="bg-[#0a0a0f] text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Media Manager
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your images, videos, and audio files
            </p>
          </div>

          <button
            onClick={uploadModal.open}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Media</span>
          </button>
        </div>

        <Container className="mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-purple-400" />
              <span className="font-medium text-gray-200">Storage Usage</span>
            </div>
            <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
              Upgrade Plan
            </button>
          </div>

          <ProgressBar
            percentage={storagePercentage}
            barClassName="bg-purple-500"
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {bytesToSize(STORAGE_USED)} of {bytesToSize(STORAGE_LIMIT)} used
            </span>
            <span className="text-gray-400">
              {bytesToSize(STORAGE_LIMIT - STORAGE_USED)} available
            </span>
          </div>
        </Container>

        <Container>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="p-6">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedia.map((media) => (
                <MediaCard media={media} onClick={setSelectedMedia} />
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Upload Modal */}
      <UploadMediaModal
        isOpen={uploadModal.isOpen}
        onClose={uploadModal.close}
        onUpload={async (file: File) => {
          return true;
        }}
      />

      {/* Preview Modal */}
      <PreviewMediaModal
        media={selectedMedia}
        onClose={() => {
          setSelectedMedia(null);
        }}
      />
    </div>
  );
}
