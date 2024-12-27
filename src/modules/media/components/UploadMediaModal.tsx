import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import Modal from '@/shared/components/Modal';
import { bytesToSize } from '@/shared/utils/fileUtils';

interface UploadMediaModalProps {
  onClose: () => void;
  isOpen: boolean;
  onUpload: (file: File) => Promise<boolean>;
}

export default function UploadMediaModal({
  onClose,
  isOpen,
  onUpload,
}: UploadMediaModalProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const result = await onUpload(uploadFile!);

    if (result) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Upload Media" onClose={onClose}>
      <div className="p-6">
        {!uploadFile ? (
          <div className="border-2 border-dashed border-white/10 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <Plus className="h-8 w-8 text-gray-400 mb-4" />
              <p className="text-sm text-gray-400 text-center mb-4">
                Drag and drop your files here, or click to select files
              </p>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,audio/*"
              />
              <label
                htmlFor="file-upload"
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                Select Files
              </label>
            </div>
          </div>
        ) : (
          <div>
            {uploadPreview && (
              <img
                src={uploadPreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {uploadFile.name} ({bytesToSize(uploadFile.size)})
              </span>
              <button
                onClick={() => {
                  setUploadFile(null);
                  setUploadPreview('');
                }}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/5">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={handleUpload}
          disabled={!uploadFile}
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload
        </button>
      </div>
    </Modal>
  );
}
