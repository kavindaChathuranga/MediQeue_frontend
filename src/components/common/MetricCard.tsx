import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'success';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border',
  primary: 'bg-primary/10 border-primary/20',
  accent: 'bg-accent/10 border-accent/20',
  warning: 'bg-medical-yellow/20 border-medical-yellow/30',
  success: 'bg-medical-green/20 border-medical-green/30',
};

const iconStyles = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  warning: 'bg-medical-yellow text-foreground',
  success: 'bg-medical-green text-foreground',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 transition-all hover:shadow-md',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                'text-sm font-medium',
                trend.positive ? 'text-medical-green' : 'text-destructive'
              )}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
