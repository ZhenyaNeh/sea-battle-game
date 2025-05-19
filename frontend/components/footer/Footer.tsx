'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaDiscord,
  FaYoutube,
} from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const Footer = ({ className, ...props }: React.ComponentProps<'header'>) => {
  const { user } = useAuth();

  return (
    <footer
      className={cn(
        'w-full h-60 flex justify-center flex-wrap backdrop-blur pt-10',
        className,
      )}
      {...props}
    >
      {' '}
      <div className="w-full flex justify-center items-center">
        <Separator
          className="container max-w-7xl bg-zinc-400"
          orientation="horizontal"
        />
      </div>
      <div className="w-full flex justify-center items-center flex-wrap">
        <div className="container max-w-7xl flex justify-between p-3 backdrop-blur flex-wrapc">
          <div className="flex-1 flex justify-start items-start">
            <div className="mr-10 flex justify-start items-start max-w-40 flex-wrap">
              <Link className="link-hover font-bold" href="/">
                Sea Battle
              </Link>
              <div className="mt-2 flex flex-col gap-0.5">
                <Link href="/games-catalog" className="link-hover">
                  Game Catalog
                </Link>
                {user ? (
                  <>
                    <Link href="/friends" className="link-hover">
                      Friend
                    </Link>
                    <Link href="/statistics" className="link-hover">
                      Statistics
                    </Link>
                  </>
                ) : (
                  <></>
                )}

                {/* <Link href="/" className="link-hover">
                  About us
                </Link> */}
              </div>
            </div>
            {/* <div className="mr-10 flex justify-start items-start max-w-40 flex-wrap">
              <Link className="text-2xs text-primary font-bold" href="/">
                Game-Platform
              </Link>
              <Link className="text-2xs text-primary font-light mt-2" href="/">
                Game-Platform
              </Link>
              <Link
                href="/"
                className="text-2xs text-primary font-light mt-0.5"
              >
                Game-Platform
              </Link>
            </div> */}
          </div>

          <div className="flex-1 flex justify-end items-start flex-wrap">
            <div className="flex justify-center h-8">
              <Link
                className="text-primary font-bold link-hover"
                href="https://discordapp.com/users/626637579084890142"
              >
                <FaDiscord size={32} />
              </Link>
              <div className="mx-5 h-[90%] border-r-[1.5px] border-zinc-400" />
              <Link
                className="text-primary font-bold link-hover"
                href="https://www.youtube.com/channel/UCwNTxMcdUP1jrPBFOpTRrog"
              >
                <FaYoutube size={32} />
              </Link>
              <div className="mx-5 h-[90%] border-r-[1.5px] border-zinc-400" />
              <Link
                className="text-primary font-bold link-hover"
                href="https://www.instagram.com/zhenya.nehaychik?igsh=a2tyZ2J4MDVsMGJ2"
              >
                <FaInstagram size={32} />
              </Link>
              <div className="mx-5 h-[90%] border-r-[1.5px] border-zinc-400" />
              <Link
                className="text-primary font-bold link-hover"
                href="https://www.facebook.com/profile.php?id=100037764571500"
              >
                <FaFacebook size={32} />
              </Link>
              <div className="mx-5 h-[90%] border-r-[1.5px] border-zinc-400" />
              <Link
                className="text-primary font-bold link-hover"
                href="https://x.com/ZNehajcik20464?s=09"
              >
                <FaTwitter size={32} />
              </Link>
            </div>
            <div className="w-full flex justify-end items-start">
              <span>Contact us: (33)-360-6216</span>
            </div>
            <div className="w-full flex justify-end items-start">
              <span>Get gaming news and artTech promotions and offers!</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <span className="mb-5">
          © 2024-2025 artTech All rights reserved. Site Map | Terms | Privacy |
          Disclaimer
        </span>
      </div>
    </footer>
  );
};

export default Footer;
