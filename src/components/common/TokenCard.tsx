import { cn } from '@/lib/utils';
import { QueueToken } from '@/types';
import { Clock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TokenCardProps {
  token: QueueToken;
  onCall?: () => void;
  onMarkUrgent?: () => void;
  onSkip?: () => void;
  onComplete?: () => void;
  showActions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  waiting: {
    label: 'Waiting',
    className: 'bg-status-waiting/20 text-status-waiting border-status-waiting/30',
    dot: 'bg-status-waiting',
  },
  'in-room': {
    label: 'In Room',
    className: 'bg-status-inroom/20 text-status-inroom border-status-inroom/30',
    dot: 'bg-status-inroom',
  },
  urgent: {
    label: 'Urgent',
    className: 'bg-status-urgent/20 text-status-urgent border-status-urgent/30',
    dot: 'bg-status-urgent',
  },
  completed: {
    label: 'Completed',
    className: 'bg-status-completed/20 text-status-completed border-status-completed/30',
    dot: 'bg-status-completed',
  },
  skipped: {
    label: 'Skipped',
    className: 'bg-status-skipped/20 text-status-skipped border-status-skipped/30',
    dot: 'bg-status-skipped',
  },
};

const sizeStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function TokenCard({
  token,
  onCall,
  onMarkUrgent,
  onSkip,
  onComplete,
  showActions = false,
  size = 'md',
  className,
}: TokenCardProps) {
  const status = statusConfig[token.status];

  return (
    <div
      className={cn(
        'rounded-xl border bg-card transition-all hover:shadow-md',
        token.status === 'urgent' && 'border-status-urgent/50 ring-2 ring-status-urgent/20',
        sizeStyles[size],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center justify-center rounded-lg font-mono font-bold',
              size === 'lg' ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-lg',
              'bg-primary text-primary-foreground'
            )}
          >
            {token.tokenNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{token.patientName}</span>
            </div>
            {token.doctorName && (
              <p className="text-sm text-muted-foreground">{token.doctorName}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {token.estimatedWaitTime > 0 
                  ? `~${token.estimatedWaitTime} min wait` 
                  : 'Now serving'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn('border', status.className)}>
            <span className={cn('mr-1.5 h-2 w-2 rounded-full', status.dot)} />
            {status.label}
          </Badge>
          {token.status === 'urgent' && (
            <AlertCircle className="h-5 w-5 text-status-urgent" />
          )}
        </div>
      </div>

      {showActions && (
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          {token.status === 'waiting' && (
            <>
              <Button size="sm" onClick={onCall}>
                Call Patient
              </Button>
              <Button size="sm" variant="outline" onClick={onMarkUrgent}>
                Mark Urgent
              </Button>
              <Button size="sm" variant="ghost" onClick={onSkip}>
                Skip
              </Button>
            </>
          )}
          {token.status === 'in-room' && (
            <Button size="sm" variant="default" onClick={onComplete}>
              Complete
            </Button>
          )}
          {token.status === 'urgent' && (
            <Button size="sm" onClick={onCall}>
              Call Immediately
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
