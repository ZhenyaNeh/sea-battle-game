import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserService } from '@/lib/service/user.service';
import { UsersPaginateInfo } from '@/lib/types/playerTypes';
import { useRouter } from 'next/navigation';

export default function UsersTable() {
  const [users, setUsers] = useState<UsersPaginateInfo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const limit = 15;

  // const fetchUsers = async () => {
  //   try {
  //     const response = await UserService.getPaginatedUsers(page, limit);
  //     console.log(response);
  //     if (response) {
  //       setUsers(response.data);
  //       setTotalPages(response.meta.totalPages);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //   }
  // };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getPaginatedUsers(page, limit);
        console.log(response);
        if (response) {
          setUsers(response.data);
          setTotalPages(response.meta.totalPages);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page]);

  const handleSeeClick = (id: string) => {
    console.log('handle see', id);
    router.push(`/profile/${id}`);
  };

  return (
    <div className="space-y-4 p-2 w-full">
      <Table>
        <TableCaption>List of registered users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead>Nickname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Rating</TableHead>
            <TableHead className="text-right">See player profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <Avatar className="size-10 text-1xl font-bold">
                  <AvatarImage
                    src={UserService.getProfilePhoto(user?.avatarUrl || '')}
                  />
                  <AvatarFallback>
                    {user?.nickname?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.nickname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">{user.rating}</TableCell>
              <TableCell className="text-right">
                <Button onClick={() => handleSeeClick(user._id)}>See</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
