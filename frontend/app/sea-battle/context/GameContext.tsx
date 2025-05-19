'use client';

import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useGameplay } from './GameplayContext';
import { Socket } from 'socket.io-client';
import { Hit, Ship } from '@/lib/types/shipTypes';
import { useAuth } from '@/hooks/useAuth';
import { OpponentInfo } from '@/lib/types/apiTypes';
import { toast } from 'sonner';
import { CellState, GameState, OpponentCellState } from '@/lib/types/gameTypes';
import { RoomService } from '@/lib/service/room.service';
import { TypeOfGameEvents } from '@/lib/emum';
import { handleBrokenWeaponShot } from '@/lib/common';
import { eventTokenInstance } from '@/lib/service/user.service';
import { outOfBounds } from '@/lib/board';
import { useSound } from '@/lib/sounds/SoundContext';

interface UserInfo {
  _id: string;
  nickname: string;
  email: string;
  role: string;
  rating: number;
  avatarUrl: string;
  token: string;
}

type GameContextType = {
  socket: Socket | null;
  isConnected: boolean;
  roomId: string;
  user: UserInfo | null;
  isAuth: boolean;
  userShipPositions: Ship[] | null;
  opponentInfo: OpponentInfo | null;
  gameState: GameState;
  openDialog: boolean;
  eventDialog: boolean;
  currentEvent: TypeOfGameEvents;
  liveShipsAfterBattle: RefObject<number>;
  userCurrentRating: RefObject<number>;
  opponentShips: Ship[] | null;
  resultScore: RefObject<{ user: number; opponent: number }>;
  hoveredCell: { x: number; y: number } | null;
  currentGameType: RefObject<string>;
  setHighlightCellsRocket(x: number, y: number, color?: string): Promise<void>;
  setHighlightCellsRadar(x: number, y: number, color?: string): Promise<void>;
  setHoveredCell: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
  setOpponentShips: Dispatch<SetStateAction<Ship[] | null>>;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  setEventDialog: Dispatch<SetStateAction<boolean>>;
  setCurrentEvent: Dispatch<SetStateAction<TypeOfGameEvents>>;
  setGameState: Dispatch<SetStateAction<GameState>>;
  setOpponentInfo: Dispatch<SetStateAction<OpponentInfo | null>>;
  setUserShipPositions: Dispatch<SetStateAction<Ship[] | null>>;
  setRoomId: Dispatch<SetStateAction<string>>;
  fireEvent(x: number, y: number): void;
  fetchData(roomId: string): Promise<void>;
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuth } = useAuth();
  const { socket, isConnected } = useGameplay();
  const [roomId, setRoomId] = useState<string>('');
  const [opponentInfo, setOpponentInfo] = useState<OpponentInfo | null>(null);
  const [userShipPositions, setUserShipPositions] = useState<Ship[] | null>(
    null,
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [eventDialog, setEventDialog] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<TypeOfGameEvents>(
    TypeOfGameEvents.noSelect,
  );
  const [opponentShips, setOpponentShips] = useState<Ship[] | null>(null);
  const liveShipsAfterBattle = useRef<number>(0);
  const userCurrentRating = useRef<number>(0);
  const currentGameType = useRef<string>('sea-battle-classic');
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const resultScore = useRef<{ user: number; opponent: number }>({
    user: 0,
    opponent: 0,
  });
  const { playSound } = useSound();
  const initialGameState = useMemo<GameState>(
    () => ({
      board: Array(10)
        .fill(null)
        .map(() => Array(10).fill(null)),
      opponentBoard: Array(10)
        .fill(null)
        .map(() => Array(10).fill(null)),
      currentTurn: false,
      gameOver: false,
      winner: '',
    }),
    [],
  );
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  useEffect(() => {
    if (userShipPositions) setBorderCells(userShipPositions);
  }, [userShipPositions]);

  useEffect(() => {
    if (gameState.currentTurn && !gameState.gameOver) setEventDialog(true);
  }, [gameState.currentTurn, gameState.gameOver]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleFireResult = async (results: Hit[] | Hit) => {
      const isTurn = await RoomService.isCurrentUserTurn(roomId);
      // toast.success(`Выстрел выполнен${JSON.stringify(results)}`);
      setGameState((prev) => {
        const newOpponentBoard = [...prev.opponentBoard];
        const hitsArray = Array.isArray(results) ? results : [results];

        for (const hitRes of hitsArray) {
          newOpponentBoard[hitRes.x] = [...newOpponentBoard[hitRes.x]];
          newOpponentBoard[hitRes.x][hitRes.y] = hitRes.hit ? 'hit' : 'miss';
        }

        for (const hitRes of hitsArray) {
          if (hitRes.hit) {
            playSound('hit', 0.5);
          } else {
            playSound('miss', 0.5);
          }
        }

        return {
          ...prev,
          opponentBoard: newOpponentBoard,
          currentTurn: isTurn ? isTurn.isCreatorTurn : false,
        };
      });
      // if (isTurn ? isTurn.isCreatorTurn : false) {
      //   setEventDialog(true);
      // }
    };

    const handleOpponentFire = async (results: Hit[] | Hit) => {
      const isTurn = await RoomService.isCurrentUserTurn(roomId);
      // toast.success(`Ответый огонь${JSON.stringify(results)}`);
      setGameState((prev) => {
        const newBoard = [...prev.board];
        const hitsArray = Array.isArray(results) ? results : [results];

        for (const hitRes of hitsArray) {
          newBoard[hitRes.x] = [...newBoard[hitRes.x]];
          newBoard[hitRes.x][hitRes.y] = hitRes.hit ? 'hit' : 'miss';
        }

        for (const hitRes of hitsArray) {
          if (hitRes.hit) {
            playSound('hit', 0.5);
          } else {
            playSound('miss', 0.5);
          }
        }

        return {
          ...prev,
          board: newBoard,
          currentTurn: isTurn ? isTurn.isCreatorTurn : false,
        };
      });
      // if (isTurn ? isTurn.isCreatorTurn : false) {
      //   setEventDialog(true);
      // }
    };

    const handleRadarResult = async (results: Hit[]) => {
      const isTurn = await RoomService.isCurrentUserTurn(roomId);
      setGameState((prev) => {
        return {
          ...prev,
          currentTurn: isTurn ? isTurn.isCreatorTurn : false,
        };
      });
      playSound('radar', 0.5);
      // if (isTurn ? isTurn.isCreatorTurn : false) {
      //   setEventDialog(true);
      // }
      setHighlightCellsRadarResult(results, '#3b80fc');
    };

    const handleRadarOpponentResult = async () => {
      const isTurn = await RoomService.isCurrentUserTurn(roomId);
      setGameState((prev) => {
        return {
          ...prev,
          currentTurn: isTurn ? isTurn.isCreatorTurn : false,
        };
      });
      // if (isTurn ? isTurn.isCreatorTurn : false) {
      //   setEventDialog(true);
      // }
    };

    const handleStormResult = async (result: {
      playerState: Ship[];
      playerAction: Hit[];
    }) => {
      const isTurn = await RoomService.isCurrentUserTurn(roomId);
      console.log(isTurn);
      setGameState((prev) => {
        const newBoard = Array(10)
          .fill(null)
          .map(() => Array(10).fill(null));

        const hitsArray = Array.isArray(result.playerAction)
          ? result.playerAction
          : [result.playerAction];

        for (const hitRes of hitsArray) {
          newBoard[hitRes.x] = [...newBoard[hitRes.x]];
          newBoard[hitRes.x][hitRes.y] = hitRes.hit ? 'hit' : 'miss';
        }

        return {
          ...prev,
          board: newBoard,
          currentTurn: isTurn ? isTurn.isCreatorTurn : false,
        };
      });
      playSound('storm', 0.5);
      setUserShipPositions(result.playerState);
    };
    const handleOpponentStorm = async (result: { playerAction: Hit[] }) => {
      toast.info('The opponent had a storm');
      const isTurn = await RoomService.isCurrentUserTurn(roomId);
      console.log(isTurn);
      setGameState((prev) => {
        const newOpponentBoard = Array(10)
          .fill(null)
          .map(() => Array(10).fill(null));
        const hitsArray = Array.isArray(result.playerAction)
          ? result.playerAction
          : [result.playerAction];

        for (const hitRes of hitsArray) {
          newOpponentBoard[hitRes.x] = [...newOpponentBoard[hitRes.x]];
          newOpponentBoard[hitRes.x][hitRes.y] = hitRes.hit ? 'hit' : 'miss';
        }

        return {
          ...prev,
          opponentBoard: newOpponentBoard,
          currentTurn: isTurn ? isTurn.isCreatorTurn : false,
        };
      });
    };

    const handleGameOver = async (result: { winner: string }) => {
      console.log(result.winner);
      toast.success('Game is cancelled.');
      await isGameOver(roomId);
    };

    const handleFireError = (result: { error: string }) => {
      toast.error(result.error);
    };

    socket.on('fire_result', handleFireResult);
    socket.on('radar_result', handleRadarResult);
    socket.on('storm_result', handleStormResult);
    socket.on('opponent_storm', handleOpponentStorm);
    socket.on('radar_opponent_result', handleRadarOpponentResult);
    socket.on('opponent_fire', handleOpponentFire);
    socket.on('game_over', handleGameOver);
    socket.on('fire_error', handleFireError);

    return () => {
      socket.off('fire_result', handleFireResult);
      socket.off('radar_result', handleRadarResult);
      socket.off('storm_result', handleStormResult);
      socket.off('opponent_storm', handleOpponentStorm);
      socket.off('radar_opponent_result', handleRadarOpponentResult);
      socket.off('opponent_fire', handleOpponentFire);
      socket.off('game_over', handleGameOver);
      socket.off('fire_error', handleFireError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, playSound, roomId, socket, user?._id]);

  const fireEvent = (x: number, y: number) => {
    if (!socket || !isConnected) {
      toast.error('Failed to connect to the game server');
      return;
    }

    if (gameState.gameOver) {
      toast.warning('Game allready complited');
      return;
    }

    if (!gameState.currentTurn) {
      toast.warning('Its not your turn now');
      return;
    }

    if (x < 0 || x > 9 || y < 0 || y > 9) {
      toast.error('Uncorrent cord');
      return;
    }

    if (currentGameType.current !== 'sea-battle-classic') {
      switch (currentEvent) {
        case TypeOfGameEvents.noEvent: {
          socket.emit(
            'fire',
            { x, y, roomId },
            (ack: { success?: boolean; error?: string }) => {
              if (!ack?.success) {
                toast.error(ack?.error || 'Error fire');
              }
            },
          );
          break;
        }
        case TypeOfGameEvents.brokenWeapon: {
          const [newX, newY] = handleBrokenWeaponShot(x, y);
          socket.emit(
            'broken_weapon',
            { x: newX, y: newY, roomId },
            (ack: { success?: boolean; error?: string }) => {
              if (!ack?.success) {
                toast.error(ack?.error || 'Error broken weapon');
              }
            },
          );
          break;
        }
        case TypeOfGameEvents.mine: {
          socket.emit(
            'mine',
            { x, y, roomId },
            (ack: { success?: boolean; error?: string }) => {
              if (!ack?.success) {
                toast.error(ack?.error || 'Error mine');
              }
            },
          );
          break;
        }
        case TypeOfGameEvents.rocket: {
          socket.emit(
            'rocket',
            { x, y, roomId },
            (ack: { success?: boolean; error?: string }) => {
              if (!ack?.success) {
                toast.error(ack?.error || 'Error rocket');
              }
            },
          );
          break;
        }
        case TypeOfGameEvents.radar: {
          socket.emit(
            'radar',
            { x, y, roomId },
            (ack: { success?: boolean; error?: string }) => {
              if (!ack?.success) {
                toast.error(ack?.error || 'Error radar');
              }
            },
          );
          break;
        }
        default: {
          socket.emit(
            'fire',
            { x, y, roomId },
            (ack: { success?: boolean; error?: string }) => {
              if (!ack?.success) {
                toast.error(ack?.error || 'Error fire');
              }
            },
          );
          break;
        }
      }
    } else {
      socket.emit(
        'fire',
        { x, y, roomId },
        (ack: { success?: boolean; error?: string }) => {
          if (!ack?.success) {
            toast.error(ack?.error || 'Error fire');
          }
        },
      );
    }
    setCurrentEvent(0);
    eventTokenInstance.set('0');
  };

  const fetchData = async (roomId: string) => {
    try {
      setRoomId(roomId);

      const data = await RoomService.getPlayer(roomId);
      if (data) {
        userCurrentRating.current = data.currentRating;
        setUserShipPositions(data.playerState);
      }

      const dataRoom = await RoomService.getCurrentGameId(roomId);
      if (dataRoom) {
        currentGameType.current = dataRoom.gameId;
      }

      const opponent = await RoomService.getOpponentPlayer(roomId);
      if (opponent) setOpponentInfo(opponent);

      const isCreater = await RoomService.isCurrentUserTurn(roomId);

      if (isCreater) {
        setGameState((prev) => ({
          ...prev,
          currentTurn: isCreater.isCreatorTurn,
        }));
        if (
          currentGameType.current !== 'sea-battle-classic' &&
          isCreater.isCreatorTurn &&
          !gameState.gameOver
        ) {
          setEventDialog(true);
        }
      }

      if (data && opponent) {
        setGameState((prev) => {
          const newBoard = [...prev.board];
          const newOpponentBoard = [...prev.opponentBoard];

          if (Array.isArray(data.playerActions)) {
            for (const hitRes of data.playerActions) {
              const { x, y } = hitRes;
              newBoard[x] = [...newBoard[x]];
              newBoard[x][y] = hitRes.hit ? 'hit' : 'miss';
            }
          }

          if (Array.isArray(opponent.playerActions)) {
            for (const hitRes of opponent.playerActions) {
              const { x, y } = hitRes;
              newOpponentBoard[x] = [...newOpponentBoard[x]];
              newOpponentBoard[x][y] = hitRes.hit ? 'hit' : 'miss';
            }
          }

          isGameOver(roomId);

          return {
            ...prev,
            board: newOpponentBoard as CellState[][],
            opponentBoard: newBoard as OpponentCellState[][],
          };
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных комнаты:', error);
    }
  };

  async function isGameOver(roomId: string) {
    const isGameOver = await RoomService.gameOver(roomId);
    console.log(isGameOver);

    if (isGameOver && isGameOver.status === 'completed') {
      setGameState((prev) => {
        return {
          ...prev,
          gameOver: true,
          winner: isGameOver.winner,
        };
      });
      liveShipsAfterBattle.current = isGameOver.liveShips;
      setOpponentShips(isGameOver.opponentShips);
      resultScore.current = {
        user: isGameOver.userScore,
        opponent: isGameOver.opponentScore,
      };
      if (isGameOver.winner === user?._id) {
        playSound('win', 0.5);
      } else {
        playSound('lose', 0.5);
      }
      console.log(isGameOver.winner);
      console.log(user?._id);
      setOpenDialog(true);
    }
  }

  async function setHighlightCellsRadar(
    x: number,
    y: number,
    color: string = '',
  ) {
    const newX = Math.max(1, Math.min(8, x));
    const newY = Math.max(1, Math.min(8, y));

    const startX = Math.max(0, newX - 1);
    const endX = Math.min(9, newX + 1);
    const startY = Math.max(0, newY - 1);
    const endY = Math.min(9, newY + 1);

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        const cell = document.querySelector(
          `.cell-highlight[data-id="cell-${i}-${j}"]`,
        ) as HTMLElement | null;
        if (cell) cell.style.backgroundColor = color;
      }
    }
  }

  async function setHighlightCellsRadarResult(hits: Hit[], color: string = '') {
    for (const hit of hits) {
      if (hit.hit) {
        const cell = document.querySelector(
          `.cell-highlight[data-id="cell-${hit.x}-${hit.y}"]`,
        ) as HTMLElement | null;
        if (cell) cell.style.backgroundColor = color;
      }
    }

    setTimeout(() => {
      for (const hit of hits) {
        if (hit.hit) {
          const cell = document.querySelector(
            `.cell-highlight[data-id="cell-${hit.x}-${hit.y}"]`,
          ) as HTMLElement | null;
          if (cell) cell.style.backgroundColor = '';
        }
      }
    }, 4000);
  }

  async function setHighlightCellsRocket(
    x: number,
    y: number,
    color: string = '',
  ) {
    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (!outOfBounds([newX, newY])) {
        const cell = document.querySelector(
          `.cell-highlight[data-id="cell-${newX}-${newY}"]`,
        ) as HTMLElement | null;

        if (cell) cell.style.backgroundColor = color;
      }
    }
  }

  function setBorderCells(ships: Ship[], border: string = 'none') {
    for (const ship of ships) {
      const { x, y } = ship;
      for (let i = 0; i <= ship.w; i++) {
        for (let j = 0; j <= ship.h; j++) {
          const cell = document.querySelector(
            `.cell-class[data-id="cell-${x + j}-${y + i}"]`,
          ) as HTMLElement | null;
          if (cell) cell.style.border = border;
        }
      }
    }
  }

  return (
    <GameContext.Provider
      value={{
        socket,
        isConnected,
        roomId,
        user,
        isAuth,
        userShipPositions,
        opponentInfo,
        gameState,
        openDialog,
        eventDialog,
        currentEvent,
        liveShipsAfterBattle,
        opponentShips,
        userCurrentRating,
        resultScore,
        hoveredCell,
        currentGameType,
        setHighlightCellsRadar,
        setHighlightCellsRocket,
        setHoveredCell,
        setOpponentShips,
        setOpenDialog,
        setEventDialog,
        setCurrentEvent,
        setGameState,
        setOpponentInfo,
        setUserShipPositions,
        setRoomId,
        fireEvent,
        fetchData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a BorderProvider');
  }
  return context;
};
