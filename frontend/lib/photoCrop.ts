import { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function convertToPixelCrop(
  crop: Crop,
  imageWidth: number,
  imageHeight: number,
): PixelCrop {
  if (crop.unit === 'px') {
    return crop as PixelCrop;
  }

  return {
    unit: 'px',
    x: (crop.x * imageWidth) / 100,
    y: (crop.y * imageHeight) / 100,
    width: (crop.width * imageWidth) / 100,
    height: (crop.height * imageHeight) / 100,
  };
}

export async function getCroppedImage(
  image: HTMLImageElement,
  crop: PixelCrop,
  originalFile: File,
): Promise<File> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }

      const croppedFile = new File([blob], originalFile.name, {
        type: originalFile.type,
        lastModified: Date.now(),
      });

      resolve(croppedFile);
    }, originalFile.type);
  });
}
