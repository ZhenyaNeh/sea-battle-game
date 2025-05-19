import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useGame } from '@/app/sea-battle/context/GameContext';
// import RollDice from '../RoolDice';
import { motion } from 'framer-motion';
import { DiceFace } from '../RoolDice';
import { TypeOfGameEvents } from '@/lib/emum';
import { eventTokenInstance } from '@/lib/service/user.service';
import { toast } from 'sonner';
import { eventDescriptions } from '@/lib/eventDescription';

const getWeightedRandom = () => {
  const probabilities = [40, 15, 15, 13, 10, 8];
  const random = Math.random() * 100;

  let sum = 0;
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (random <= sum) return i + 1;
  }
  return 6;
};

function EventDialog() {
  const {
    eventDialog,
    currentEvent,
    socket,
    roomId,
    setCurrentEvent,
    setEventDialog,
  } = useGame();
  const [value, setValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  useEffect(() => {
    const checkEvent = eventTokenInstance.get();

    if (Number(checkEvent) > 0 && Number(checkEvent) < 7) {
      setCurrentEvent(Number(checkEvent));
      setValue(Number(checkEvent));
    }
  }, [setCurrentEvent]);

  // useEffect(() => {
  //   if (currentEvent === TypeOfGameEvents.noSelect) rollDice();
  // }, []);

  const rollDice = () => {
    if (isRolling) return; // Защита от повторного клика во время анимации

    setIsRolling(true);
    const newValue = getWeightedRandom();

    // После завершения анимации обновляем значение
    setTimeout(() => {
      // setCurrentEvent(6);
      // eventTokenInstance.set('6');
      // setValue(6);
      setCurrentEvent(newValue);
      eventTokenInstance.set(newValue.toString());
      setValue(newValue);
      setIsRolling(false);
    }, 1000);
  };

  const handleOpenChange = () => {
    if (currentEvent === TypeOfGameEvents.storm) {
      if (!socket) return;
      socket.emit(
        'storm',
        { roomId },
        (ack: { success?: boolean; error?: string }) => {
          if (!ack?.success) {
            toast.error(ack?.error || 'Ошибка при выполнении выстрела');
          }
        },
      );
      setCurrentEvent(0);
      eventTokenInstance.set('0');
    }
    setEventDialog(!eventDialog);
  };

  return (
    <div>
      <Dialog open={eventDialog}>
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Roll Dice for event</DialogTitle>
            <DialogDescription>
              Сlick on the cube to generate an event (the event cannot be
              skipped)
            </DialogDescription>
          </DialogHeader>
          <div className="py-5 grid grid-cols-2 gap-2">
            <div className="w-ful flex justify-center items-center">
              <motion.div
                onClick={() => {
                  if (currentEvent === TypeOfGameEvents.noSelect) rollDice();
                }}
                animate={{
                  rotate: isRolling ? [0, 360, 720] : 0,
                  scale: isRolling ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  ease: 'easeOut',
                }}
                className="w-[100px] h-[100px] bg-muted rounded-[15px] relative cursor-pointer flex justify-center items-center select-none"
              >
                <DiceFace value={value} />
              </motion.div>
            </div>

            <div className="w-full flex justify-center items-center">
              {currentEvent !== TypeOfGameEvents.noSelect ? (
                <div className={'text-center'}>
                  <div className="text-4xl mb-2">
                    {eventDescriptions[currentEvent].icon}
                  </div>
                  <h3 className="text-xl font-bold">
                    {eventDescriptions[currentEvent].title}
                  </h3>
                  <p className="text-sm">
                    {eventDescriptions[currentEvent].description}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">🎲</div>
                  <h3 className="text-xl font-bold">Roll the dice!</h3>
                  <p className="text-sm">Select a random event</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            {currentEvent !== TypeOfGameEvents.noSelect ? (
              <Button onClick={handleOpenChange} variant={'outline'}>
                Continue game
              </Button>
            ) : (
              // <Button>Roll Dice</Button>
              <></>
            )}

            {/* <Button onClick={handleSubmit}>Go on home page</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventDialog;
