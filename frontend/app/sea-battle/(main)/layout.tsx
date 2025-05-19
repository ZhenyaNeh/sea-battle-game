import { BoardProvider } from '../context/BoardContext';
import { MatchmakingProvider } from '../context/MathcmakingContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BoardProvider>
      <MatchmakingProvider>{children}</MatchmakingProvider>
    </BoardProvider>
  );
}
