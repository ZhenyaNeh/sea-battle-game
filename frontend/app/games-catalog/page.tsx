'use client';

import { Button } from '@/components/ui/button';
import {
  // Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMotion,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const GamesCatalog = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-start">
        <h1 className="text-2xl text-primary text-center font-bold w-full mb-5">
          The best online game
        </h1>
        <div className="flex w-full justify-center items-center flex-wrap">
          <CardMotion className="w-[350px] m-5">
            <CardHeader>
              <Image
                className="rounded-lg"
                src="/img/sea-battle.jpg"
                alt="Описание изображения"
                width={300}
                height={200}
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl">Sea Battle Classic</CardTitle>
              <CardDescription className="text-[16px]">
                This game for two person
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Link href="/games-catalog/sea-battle-info?type=classic">
                  Show More Info
                </Link>
              </Button>
            </CardFooter>
          </CardMotion>
          <CardMotion className="w-[350px] m-5">
            <CardHeader>
              <Image
                className="rounded-lg"
                src="/img/sea-battle-event.jpg"
                alt="Описание изображения"
                width={300}
                height={200}
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl">Sea Battle With Events</CardTitle>
              <CardDescription className="text-[16px]">
                This game for two person
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Link href="/games-catalog/sea-battle-info?type=event">
                  Show More Info
                </Link>
              </Button>
            </CardFooter>
          </CardMotion>
        </div>
      </div>
    </>
  );
};

export default GamesCatalog;
