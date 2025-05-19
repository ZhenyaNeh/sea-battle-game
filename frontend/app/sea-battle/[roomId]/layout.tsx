import { GameProvider } from '../context/GameContext';
import { GameplayProvider } from '../context/GameplayContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GameplayProvider>
      <GameProvider>{children}</GameProvider>
    </GameplayProvider>
  );
}
