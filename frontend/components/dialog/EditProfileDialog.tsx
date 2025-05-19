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
import { UserService } from '@/lib/service/user.service';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/features/user/userSlice';
import { Loader2 } from 'lucide-react';

export function EditProfileDialog() {
  const { user } = useAuth();
  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleNicknameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewNickname(e.target.value);
    },
    [],
  );

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (newNickname !== user?.nickname) {
        const responseData = await UserService.updateProfileInfo({
          nickname: newNickname,
        });

        if (responseData) {
          dispatch(updateUser({ nickname: responseData.nickname }));
          toast.success('User information updated successfully');
        }
      }
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setOpen(open);
    setNewNickname(user?.nickname || '');
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile Info</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nickname" className="text-right">
              Nickname
            </Label>
            <Input
              id="nickname"
              className="col-span-3"
              onChange={handleNicknameChange}
              value={newNickname}
              disabled={isLoading}
            />
          </div>
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
  );
}
