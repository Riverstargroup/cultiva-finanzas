import { useState } from 'react';
import { PresupuestoRapido } from '@/features/minigames/games/PresupuestoRapido';
import { InflacionChallenge } from '@/features/minigames/components/InflacionChallenge';
import { SemillasCredito } from '@/features/minigames/games/SemillasCredito';
import { MemoriaMercado } from '@/features/minigames/games/MemoriaMercado';
import { AhorraCosecha } from '@/features/minigames/games/AhorraCosecha';
import type { GameId } from '../types';

interface Props {
  gameId: GameId;
  onDone: () => void;
}

export function EmbeddedGame({ gameId, onDone }: Props) {
  const [gameKey, setGameKey] = useState(0);

  function renderGame() {
    switch (gameId) {
      case 'presupuesto-rapido':
        return (
          <PresupuestoRapido
            key={gameKey}
            mode="embedded"
            onBack={onDone}
          />
        );
      case 'inflacion-challenge':
        return (
          <InflacionChallenge
            key={gameKey}
            onRestart={() => setGameKey((k) => k + 1)}
          />
        );
      case 'semillas-credito':
        return (
          <SemillasCredito
            key={gameKey}
            mode="embedded"
            onBack={onDone}
          />
        );
      case 'memoria-mercado':
        return (
          <MemoriaMercado
            key={gameKey}
            mode="embedded"
            onBack={onDone}
          />
        );
      case 'ahorra-cosecha':
        return (
          <AhorraCosecha
            key={gameKey}
            mode="embedded"
            onBack={onDone}
          />
        );
    }
  }

  return (
    <div className="organic-card p-5">
      {renderGame()}
    </div>
  );
}
