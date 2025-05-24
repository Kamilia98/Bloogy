import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  initial?: string;
}

export default function ImageUploader({
  onUpload,
  initial = '',
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initial || null,
  );
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const maxFileSizeMB = 5;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setFile(null);
      setImagePreview(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File size should be less than ${maxFileSizeMB}MB.`);
      setFile(null);
      setImagePreview(null);
      return;
    }

    setError('');
    setFile(selectedFile);

    // Create a preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);

    // Upload image
    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const uploadRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=1c36354207c12c76b443e9717c73cff7`,
        formData,
      );
      const imageUrl = uploadRes.data.data.url;

      // Call onUpload with file and url
      if (onUpload) onUpload(imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Image upload failed. Please try again.');
      setFile(null);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
    setError('');
    if (onUpload) onUpload('');
  };

  return (
    <>
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Image preview"
            className="mx-auto h-48 max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={removeImage}
            className="bg-opacity-50 hover:bg-opacity-70 absolute top-2 right-2 rounded-full bg-gray-800 p-1 text-white"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <label
            htmlFor="image-upload"
            className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-[#4364F7] hover:bg-blue-50/30"
          >
            <Upload size={32} className="mb-2 text-gray-400" />
            <p className="mb-1 text-sm text-gray-600">
              {file ? file.name : 'Click to upload image'}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF (Max 5MB)</p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </>
  );
}
