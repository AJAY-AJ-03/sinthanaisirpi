import React, { useState } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageUrl = formData.get('imageUrl') as string;

    if (!imageUrl) {
      setError('Please enter an image URL');
      return;
    }

    // Validate if the URL is an image
    const img = new Image();
    img.onload = () => {
      onImageSelect(imageUrl);
      setError('');
      (e.target as HTMLFormElement).reset();
    };
    img.onerror = () => {
      setError('Invalid image URL. Please enter a valid image URL.');
    };
    img.src = imageUrl;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Image to Gallery</h3>
      
      <form onSubmit={handleImageUrlSubmit} className="space-y-4">
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Upload className="w-4 h-4 mr-2" />
          Add Image
        </button>
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Note: Please ensure you have the rights to use the images you add.
        </p>
      </div>
    </div>
  );
}