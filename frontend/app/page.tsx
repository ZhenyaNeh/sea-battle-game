'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
// import { useEffect } from 'react';
// import { useAuth } from '@/hooks/useAuth';

// Анимационные варианты
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonItem = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      type: 'spring',
      stiffness: 100,
    },
  },
};

const MotionButton = motion.create(Button);

export default function Home() {
  // const { user } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   window.location.reload();
  // }, [user]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="flex w-full py-25 flex-col items-center justify-center"
    >
      <motion.h2 variants={item} className="text-7xl font-bold">
        Sea Battle Game
      </motion.h2>

      <motion.h2
        variants={item}
        className="text-5xl mt-6 font-medium text-muted"
      >
        No more words
      </motion.h2>

      <motion.div variants={buttonItem}>
        <MotionButton
          className="mt-20 text-5xl font-bold h-19 w-80"
          onClick={() => router.push('games-catalog')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Play Now!
        </MotionButton>
      </motion.div>
    </motion.div>
  );
}
