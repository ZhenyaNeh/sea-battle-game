import React from 'react';
import SymbolCell from './setup/SymbolCell';
import Cell from './gameplay/Cell';
import { getChar } from '@/lib/common';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { UserService } from '@/lib/service/user.service';
import { useGame } from '@/app/sea-battle/context/GameContext';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameBoardProp {
  isUser: boolean;
}

const GameBoard = ({ isUser }: GameBoardProp) => {
  const gridSize = 10;
  const { user, opponentInfo, userCurrentRating } = useGame();

  return (
    <div className="flex-2 justify-center items-center border-[1.5px] border-border rounded-2xl mx-5">
      {/* <h2 className="text-center font-bold text-2xl pt-2">{title}</h2> */}
      {isUser ? (
        <div className="flex flex-col justify-center items-center mt-5 ml-10">
          <div className="flex items-center">
            <Avatar className="size-10 font-medium">
              <AvatarImage
                src={UserService.getProfilePhoto(user?.avatarUrl || '')}
              />
              <AvatarFallback>
                {user?.nickname?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="ml-3 text-2xl font-bold">{user?.nickname}</h2>
            <Trophy className="w-5 h-5 ml-10 mr-2" strokeWidth={2.8} />
            <h2 className="text-2xl font-bold">{`${userCurrentRating.current}`}</h2>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-5 ml-10">
          <div className="flex items-center">
            <Avatar className="size-10 font-medium">
              <AvatarImage
                src={UserService.getProfilePhoto(opponentInfo?.avatarUrl || '')}
              />
              <AvatarFallback>
                {opponentInfo?.nickname?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="ml-3 text-2xl font-bold">
              {opponentInfo?.nickname}
            </h2>
            <Trophy className="w-5 h-5 ml-10 mr-2" strokeWidth={2.8} />
            <h2 className="text-2xl font-bold">{`${opponentInfo?.rating}`}</h2>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center p-5">
        <motion.div
          className="grid grid-cols-[repeat(12,40px)] gap-0.5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0, // Задержка между анимациями детей
                delayChildren: 0, // Общая задержка перед началом
              },
            },
          }}
        >
          <SymbolCell key={'top-left'} symbol=" " />
          {Array.from({ length: gridSize }).map((_, index) => (
            <SymbolCell key={`top-${index}`} symbol={getChar(index)} />
          ))}
          <SymbolCell key={'top-right'} symbol=" " />
          {Array.from({ length: gridSize }).map((_, x) => (
            <React.Fragment key={`row-${x}`}>
              {/* Цифра слева */}
              <SymbolCell key={`left-${x}`} symbol={(x + 1).toString()} />

              {/* Ячейки игрового поля */}
              {Array.from({ length: gridSize }).map((_, y) => (
                <Cell
                  key={`cell-${x}-${y}`}
                  id={`cell-${x}-${y}`}
                  isUser={isUser}
                />
              ))}

              {/* Цифра справа */}
              <SymbolCell key={`right-${x}`} symbol={(x + 1).toString()} />
            </React.Fragment>
          ))}
          <SymbolCell key={'bottom-left'} symbol=" " />
          {Array.from({ length: gridSize }).map((_, index) => (
            <SymbolCell key={`bottom-${index}`} symbol={getChar(index)} />
          ))}
          <SymbolCell key={'bottom-right'} symbol=" " />
        </motion.div>
      </div>
    </div>
  );
};

export default GameBoard;
