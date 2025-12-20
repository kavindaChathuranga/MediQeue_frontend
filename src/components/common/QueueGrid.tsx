import { QueueToken } from '@/types';
import { TokenCard } from './TokenCard';
import { cn } from '@/lib/utils';

interface QueueGridProps {
  tokens: QueueToken[];
  onCall?: (token: QueueToken) => void;
  onMarkUrgent?: (token: QueueToken) => void;
  onSkip?: (token: QueueToken) => void;
  onComplete?: (token: QueueToken) => void;
  showActions?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function QueueGrid({
  tokens,
  onCall,
  onMarkUrgent,
  onSkip,
  onComplete,
  showActions = false,
  columns = 3,
  className,
}: QueueGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  // Sort tokens: urgent first, then by position
  const sortedTokens = [...tokens].sort((a, b) => {
    if (a.status === 'urgent' && b.status !== 'urgent') return -1;
    if (b.status === 'urgent' && a.status !== 'urgent') return 1;
    return a.position - b.position;
  });

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {sortedTokens.map((token) => (
        <TokenCard
          key={token.id}
          token={token}
          showActions={showActions}
          onCall={() => onCall?.(token)}
          onMarkUrgent={() => onMarkUrgent?.(token)}
          onSkip={() => onSkip?.(token)}
          onComplete={() => onComplete?.(token)}
        />
      ))}
    </div>
  );
}
