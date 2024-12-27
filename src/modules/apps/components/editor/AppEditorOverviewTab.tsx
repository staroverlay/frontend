import { Upload, X } from 'lucide-react';
import React, { useState } from 'react';

interface AppEditorOverviewTabProps {
  onChange: () => void;
}

export default function AppEditorOverviewTab({
  onChange,
}: AppEditorOverviewTabProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
        onChange();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          App Thumbnail
        </label>
        <div className="flex items-start space-x-6">
          <div className="relative w-32 h-32 bg-white/5 rounded-lg overflow-hidden">
            {thumbnail ? (
              <>
                <img
                  src={thumbnail}
                  alt="App thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setThumbnail(null);
                    onChange();
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">512x512px</span>
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              id="thumbnail"
              className="hidden"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            <label
              htmlFor="thumbnail"
              className="inline-flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Image</span>
            </label>
            <p className="text-sm text-gray-400 mt-2">
              Recommended size: 512x512px
              <br />
              Max file size: 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            App Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            placeholder="Enter app name"
            onChange={onChange}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Short Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            placeholder="Brief description of your app"
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Service
            </label>
            <select
              id="service"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              onChange={onChange}
            >
              <option value="twitch">Twitch</option>
              <option value="youtube">YouTube</option>
              <option value="kick">Kick</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Price
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                min="0"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="0.00"
                onChange={onChange}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">$</span>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="visibility"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Visibility
          </label>
          <select
            id="visibility"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            onChange={onChange}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>
      </div>
    </div>
  );
}
