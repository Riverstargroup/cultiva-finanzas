import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareScoreButtonProps {
  score: number;
  gameTitle: string;
}

export function ShareScoreButton({ score, gameTitle }: ShareScoreButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const message = `Saqué ${score} pts en ${gameTitle} de Cultiva Finanzas 🌱 ¿puedes superarme?`;

    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(message);
      toast({
        title: '¡Copiado!',
        description: 'Comparte tu resultado',
      });
    } catch {
      toast({
        title: 'No pudimos copiar',
        description: 'Tu navegador bloqueó el portapapeles.',
        variant: 'destructive',
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Compartir puntaje de ${gameTitle}`}
      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-3 rounded-full text-sm font-semibold transition-colors"
      style={{
        border: '1.5px solid var(--clay-soft)',
        color: 'var(--forest-deep)',
        background: 'transparent',
      }}
    >
      <Share2 className="h-4 w-4" aria-hidden="true" />
      <span>Compartir</span>
    </button>
  );
}
