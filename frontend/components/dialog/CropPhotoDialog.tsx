/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { UserService } from '@/lib/service/user.service';
import { toast } from 'sonner';
import ReactCrop, { PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useProfileForm } from '@/hooks/usePhotoCrop';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { convertToPixelCrop } from '@/lib/photoCrop';
import { Loader2, PencilIcon } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/features/user/userSlice';

export function CropPhotoDialog() {
  const { user } = useAuth();
  const {
    selectedFile,
    imgSrc,
    crop,
    setCrop,
    setCompletedCrop,
    completedCrop,
    onSelectFile,
    onImageLoad,
    processImage,
    setPreviewUrl,
    resetPhotoState,
  } = useProfileForm();

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const avatarUrl = useMemo(() => {
    return croppedPreviewUrl || '';
  }, [croppedPreviewUrl]);

  const updateCroppedPreview = useCallback(async () => {
    if (imgRef.current && completedCrop) {
      try {
        const croppedImage = await processImage(imgRef.current);
        if (croppedImage) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setCroppedPreviewUrl(reader.result as string);
          };
          reader.readAsDataURL(croppedImage);
        }
      } catch (error) {
        console.error('Failed to create cropped preview:', error);
      }
    }
  }, [completedCrop, processImage]);

  useEffect(() => {
    if (completedCrop) {
      updateCroppedPreview();
    }
  }, [completedCrop, updateCroppedPreview]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleCropComplete = (crop: PixelCrop) => {
    if (imgRef.current) {
      setCompletedCrop(
        convertToPixelCrop(
          crop,
          imgRef.current.naturalWidth,
          imgRef.current.naturalHeight,
        ),
      );
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (selectedFile && imgRef.current) {
        const croppedFile = await processImage(imgRef.current);
        if (!croppedFile) throw new Error('Failed to crop image');

        const formData = new FormData();
        formData.append('avatar', croppedFile);
        const responsePhoto = await UserService.updateProfilePhoto(formData);

        if (responsePhoto) {
          toast.success('User photo updated successfully');
          dispatch(updateUser({ avatarUrl: responsePhoto.avatarUrl }));
          const reader = new FileReader();
          reader.onloadend = () => setPreviewUrl(reader.result as string);
          reader.readAsDataURL(croppedFile);
          setOpen(false);
        }
      } else {
        setOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false); // Важно сбрасывать состояние в любом случае
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setOpen(open);
    resetPhotoState();
    setCroppedPreviewUrl(null);
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PencilIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile Photo</DialogTitle>
            <DialogDescription>
              Make changes to your profile photo here. Click save when youre
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button disabled={isLoading} onClick={handleAvatarClick}>
              Select Photo
            </Button>
            <span className="text-sm text-gray-500">
              {selectedFile ? selectedFile.name : 'No file selected'}
            </span>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right">Preview Photo</Label>
              <div className="col-span-2 flex items-center gap-4">
                <Avatar
                  className="size-20 text-4xl hover:cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {user?.nickname?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={onSelectFile}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {imgSrc && (
              <div className="grid gap-4 py-4">
                <div className="mt-4">
                  <ReactCrop
                    crop={crop}
                    onChange={setCrop}
                    onComplete={handleCropComplete}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      style={{ maxWidth: '100%', maxHeight: '300px' }}
                    />
                  </ReactCrop>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {!isLoading ? (
              <>
                <Button onClick={handleSubmit}>Save changes</Button>
                <Button variant={'outline'} onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
