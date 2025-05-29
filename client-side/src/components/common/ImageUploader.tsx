import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  styled,
  useTheme,
  alpha,
} from '@mui/material';
import { Upload, X } from 'lucide-react';
import axios from 'axios';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  initial?: string;
}

// Styled components using the theme
const UploadArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'background-color'], {
    duration: theme.transitions.duration.standard,
  }),
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  '&.disabled': {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  borderRadius: theme.shape.borderRadius * 1.5,
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
}));

const ImagePreview = styled('img')(({ theme }) => ({
  height: 192, // 48 * 4 (theme spacing)
  maxWidth: '100%',
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius * 1.5,
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: alpha(theme.palette.common.black, 0.5),
  color: theme.palette.common.white,
  backdropFilter: 'blur(4px)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.7),
  },
  width: 32,
  height: 32,
}));

const HiddenInput = styled('input')({
  display: 'none',
});

export default function ImageUploader({
  onUpload,
  initial = '',
}: ImageUploaderProps) {
  const theme = useTheme();
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
    <Box sx={{ width: '100%' }}>
      {imagePreview ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ImagePreviewContainer>
            <ImagePreview src={imagePreview} alt="Image preview" />
            <RemoveButton
              onClick={removeImage}
              aria-label="Remove image"
              size="small"
            >
              <X size={16} />
            </RemoveButton>
          </ImagePreviewContainer>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <label htmlFor="image-upload" style={{ width: '100%', display: 'block' }}>
            <UploadArea
              className={uploading ? 'disabled' : ''}
              elevation={0}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Upload size={32} color={theme.palette.text.secondary} />
                <Box>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ mb: 0.5 }}
                  >
                    {file ? file.name : 'Click to upload image'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PNG, JPG, GIF (Max {maxFileSizeMB}MB)
                  </Typography>
                </Box>
              </Box>
              <HiddenInput
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
              />
            </UploadArea>
          </label>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {uploading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Uploading...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
