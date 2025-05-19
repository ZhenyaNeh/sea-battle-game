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
import { UserService } from '@/lib/service/user.service';
// import { useRouter } from 'next/navigation';
import { UnfinishedGame as UnfinishedGameType } from '@/lib/types/gameTypes';
import { RoomService } from '@/lib/service/room.service';

export default function UnfinishedGame() {
  const [games, setGames] = useState<UnfinishedGameType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // const router = useRouter();
  const limit = 15;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getPaginatedUnfinishedGame(
          page,
          limit,
        );
        if (response) {
          setGames(response.data);
          setTotalPages(response.meta.totalPages);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page]);

  const handleDeleteClick = async (roomId: string) => {
    const res = await RoomService.deleteRoomWithPlayers(roomId);

    if (res && res.deletedRoom > 0 && res.deletedPlayers > 0) {
      const response = await UserService.getPaginatedUnfinishedGame(
        page,
        limit,
      );
      if (response) {
        setGames(response.data);
        setTotalPages(response.meta.totalPages);
      }
    }
  };

  return (
    <div className="space-y-4 p-2 w-full">
      <Table>
        <TableCaption>List of registered users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">roomId</TableHead>
            <TableHead>status</TableHead>
            <TableHead>hours ago</TableHead>
            <TableHead className="text-right">remove game</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.roomId}>
              <TableCell>{game.roomId}</TableCell>
              <TableCell>{game.status}</TableCell>
              <TableCell>{Math.round(game.minutesAgo / 60)}</TableCell>
              <TableCell className="text-right">
                <Button onClick={() => handleDeleteClick(game.roomId)}>
                  Remove
                </Button>
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
