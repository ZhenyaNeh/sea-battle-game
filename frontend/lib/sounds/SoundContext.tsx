'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type SoundType =
  | 'hit'
  | 'miss'
  | 'win'
  | 'lose'
  | 'background'
  | 'storm'
  | 'radar';

interface SoundContextType {
  playSound: (type: SoundType, volume?: number) => void;
  stopSound: (type: SoundType) => void;
  toggleMute: () => void;
  isMuted: boolean;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  isBackgroundPlaying: boolean;
}
const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const sounds = useRef<Record<SoundType, HTMLAudioElement | null>>({
    hit: null,
    miss: null,
    win: null,
    lose: null,
    storm: null,
    radar: null,
    background: null,
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);

  // const initSounds = () => {
  //   sounds.current.hit = new Audio('/sounds/hit.mp3');
  //   sounds.current.miss = new Audio('/sounds/miss.mp3');
  //   sounds.current.win = new Audio('/sounds/win.mp3');
  //   sounds.current.lose = new Audio('/sounds/lose.mp3');
  //   sounds.current.storm = new Audio('/sounds/storm.mp3');
  //   sounds.current.radar = new Audio('/sounds/radar.mp3');
  //   sounds.current.background = new Audio('/sounds/background.mp3');

  //   Object.values(sounds.current).forEach((sound) => {
  //     if (sound) {
  //       sound.preload = 'auto';
  //       sound.volume = 0.5;
  //     }
  //   });
  // };

  // Инициализация звуков
  useEffect(() => {
    sounds.current.hit = new Audio('/sounds/hit.mp3');
    sounds.current.miss = new Audio('/sounds/miss.mp3');
    sounds.current.win = new Audio('/sounds/win.mp3');
    sounds.current.lose = new Audio('/sounds/lose.mp3');
    sounds.current.storm = new Audio('/sounds/storm.mp3');
    sounds.current.radar = new Audio('/sounds/radar.mp3');
    sounds.current.background = new Audio('/sounds/background.mp3');

    // Настройка зацикливания для фоновой музыки
    const bgMusic = sounds.current.background;
    if (bgMusic) {
      bgMusic.loop = true; // Включаем зацикливание
      bgMusic.volume = 0.3; // Устанавливаем меньшую громкость для фона
    }

    // Очистка при размонтировании
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(sounds.current).forEach((sound) => {
        if (sound) {
          sound.pause();
          sound.src = '';
        }
      });
    };
  }, []);

  const playSound = (type: SoundType, volume = 0.5) => {
    if (isMuted) return;

    const sound = sounds.current[type];
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play().catch((e) => console.error('Error playing sound:', e));
    }
  };

  const stopSound = (type: SoundType) => {
    const sound = sounds.current[type];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  };

  const playBackgroundMusic = () => {
    if (isMuted) return;

    const bgMusic = sounds.current.background;
    if (bgMusic && !isBackgroundPlaying) {
      bgMusic
        .play()
        .then(() => setIsBackgroundPlaying(true))
        .catch((e) => console.error('Error playing background music:', e));
    }
  };

  const stopBackgroundMusic = () => {
    const bgMusic = sounds.current.background;
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      setIsBackgroundPlaying(false);
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (newMutedState) {
      stopBackgroundMusic();
    } else if (isBackgroundPlaying) {
      playBackgroundMusic();
    }
  };

  return (
    <SoundContext.Provider
      value={{
        playSound,
        stopSound,
        toggleMute,
        isMuted,
        playBackgroundMusic,
        stopBackgroundMusic,
        isBackgroundPlaying,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
