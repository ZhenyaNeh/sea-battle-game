'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '../ModeToggle';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { tokenInstance } from '@/api/auth.api';
import { AuthService } from '@/lib/service/auth.service';
import { login, logout } from '@/store/features/user/userSlice';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { UserService } from '@/lib/service/user.service';
// import { useGlobalReq } from '@/app/sea-battle/context/GlobalRequestContext';

const MotionLink = motion.create(Link);

const Header = ({ className, ...props }: React.ComponentProps<'header'>) => {
  // const { socket, isConnected } = useGlobalReq();
  // console.log(socket, isConnected);
  const { isAuth, user } = useAuth();

  const dispatch = useAppDispatch();

  const checkAuth = async () => {
    const token = tokenInstance.get();
    try {
      if (token) {
        const data = await AuthService.getProfile();
        if (data) {
          dispatch(login(data));
        } else {
          dispatch(logout());
        }
      }
    } catch (ex) {
      if (ex instanceof Error) console.log(ex.message);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={cn(
        'w-full flex justify-center items-center flex-wrap fixed backdrop-blur z-30',
        className,
      )}
      {...props}
    >
      <div className="container max-w-7xl mx-auto flex justify-between p-3 py-5 backdrop-blur">
        <div className="flex-1 flex justify-start items-center">
          <MotionLink
            href="/"
            className="text-2xl text-primary font-bold link-hover"
          >
            Sea-Battle Game
          </MotionLink>
        </div>
        <div className="flex-3 flex justify-center items-center">
          <MotionLink
            href="/games-catalog"
            className="text-primary font-bold py-1 link-hover"
          >
            Games catalog
          </MotionLink>
          {user ? (
            <>
              <div className="mx-5 h-[90%] border-r-[1.5px] border-zinc-400" />
              <MotionLink
                href="/friends"
                className="text-primary font-bold py-1 link-hover"
              >
                Friends
              </MotionLink>
              <div className="mx-5 h-[90%] border-r-[1.5px] border-zinc-400" />
              <MotionLink
                href="/statistics"
                className="text-primary font-bold py-1 link-hover"
              >
                Statistics
              </MotionLink>
            </>
          ) : (
            <></>
          )}

          {/* <div className="mx-5 h-[90%] border-r-[1.5px] border-zinc-400" /> */}
          {/* <MotionLink
            href="/auth"
            className="text-primary font-bold link-hover"
          >
            About us
          </MotionLink> */}
        </div>
        <div className="flex-1 flex justify-end items-center">
          {isAuth ? (
            <>
              <MotionLink
                href="/profile"
                className="text-primary font-bold flex justify-center items-center"
              >
                <Avatar className="size-10 font-medium mr-3">
                  <AvatarImage
                    src={UserService.getProfilePhoto(user?.avatarUrl || '')}
                  />
                  <AvatarFallback>
                    {user?.nickname?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="link-hover">{user?.nickname}</h2>
              </MotionLink>
            </>
          ) : (
            <MotionLink
              href="/auth"
              className="text-primary font-bold link-hover"
            >
              Sign in
            </MotionLink>
          )}
          {/* <Separator className="mx-4 bg-zinc-400" orientation="vertical" /> */}
          <div className="mx-5 h-[90%] border-r-[1.5px] border-zinc-400" />
          <ModeToggle />
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <Separator
          className="container max-w-7xl bg-zinc-400"
          orientation="horizontal"
        />
      </div>
    </header>
  );
};

export default Header;
