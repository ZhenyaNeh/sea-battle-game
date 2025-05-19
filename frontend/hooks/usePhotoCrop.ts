import { useState, useCallback } from 'react';
// import { centerAspectCrop, convertToPixelCrop } from '@/lib/utils/imageUtils';
import { Crop, PixelCrop } from 'react-image-crop';
import { useAuth } from './useAuth';
import {
  centerAspectCrop,
  convertToPixelCrop,
  getCroppedImage,
} from '@/lib/photoCrop';

export function useProfileForm() {
  const { user } = useAuth();
  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    `${user?.avatarUrl}?t=${Date.now()}`,
  );
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  const handleNicknameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewNickname(e.target.value);
    },
    [],
  );

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, 1));
    },
    [],
  );

  const processImage = useCallback(
    async (image: HTMLImageElement) => {
      if (!crop || !selectedFile) return null;

      const pixelCrop = convertToPixelCrop(
        crop,
        image.naturalWidth,
        image.naturalHeight,
      );

      return getCroppedImage(image, pixelCrop, selectedFile);
    },
    [crop, selectedFile],
  );

  const resetPhotoState = () => {
    setSelectedFile(null);
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  return {
    newNickname,
    selectedFile,
    previewUrl,
    imgSrc,
    crop,
    completedCrop,
    setCrop,
    setCompletedCrop,
    onSelectFile,
    handleNicknameChange,
    onImageLoad,
    processImage,
    setPreviewUrl,
    resetPhotoState,
  };
}
