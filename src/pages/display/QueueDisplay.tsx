import { useState, useEffect } from 'react';
import { mockQueueTokens, mockDoctors } from '@/data/mockData';
import { QueueToken } from '@/types';
import { cn } from '@/lib/utils';
import { Stethoscope, Volume2 } from 'lucide-react';

export default function QueueDisplay() {
  const [tokens, setTokens] = useState<QueueToken[]>(mockQueueTokens);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatingToken, setAnimatingToken] = useState<string | null>(null);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate queue updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a token being called
      setTokens((prev) => {
        const waiting = prev.filter((t) => t.status === 'waiting');
        if (waiting.length > 0) {
          const toCall = waiting[Math.floor(Math.random() * waiting.length)];
          setAnimatingToken(toCall.tokenNumber);
          setTimeout(() => setAnimatingToken(null), 3000);
        }
        return prev;
      });
    }, 30000); // Every 30 seconds for demo
    return () => clearInterval(interval);
  }, []);

  const currentlyServing = tokens.filter((t) => t.status === 'in-room');
  const recentlyCalled = tokens
    .filter((t) => t.calledAt)
    .sort((a, b) => new Date(b.calledAt!).getTime() - new Date(a.calledAt!).getTime())
    .slice(0, 5);

  const waitingByDoctor = mockDoctors.map((doctor) => ({
    doctor,
    waiting: tokens.filter(
      (t) => t.doctorId === doctor.id && t.status === 'waiting'
    ).length,
    current: tokens.find(
      (t) => t.doctorId === doctor.id && t.status === 'in-room'
    ),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 lg:p-10">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">MediQueue</h1>
            <p className="text-muted-foreground">Dispensary Queue Display</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Now Serving - Large Display */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border-2 bg-card p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <Volume2 className="h-6 w-6 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold">Now Serving</h2>
            </div>

            {currentlyServing.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {currentlyServing.map((token) => (
                  <div
                    key={token.id}
                    className={cn(
                      'rounded-2xl border-2 border-primary bg-primary/5 p-8 text-center transition-all',
                      animatingToken === token.tokenNumber && 'token-pulse'
                    )}
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Token Number
                    </p>
                    <p className="text-7xl font-bold text-primary mb-4 font-mono tracking-wider animate-fade-in">
                      {token.tokenNumber}
                    </p>
                    <p className="text-xl font-medium">{token.patientName}</p>
                    <div className="mt-4 rounded-lg bg-card px-4 py-2 inline-block">
                      <p className="text-sm text-muted-foreground">
                        Please proceed to
                      </p>
                      <p className="font-bold text-primary">
                        {token.doctorName} - Room 101
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed p-12 text-center">
                <p className="text-2xl text-muted-foreground">
                  No patient currently being served
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Queue Status by Doctor */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-bold mb-4">Queue Status</h3>
            <div className="space-y-4">
              {waitingByDoctor.map(({ doctor, waiting, current }) => (
                <div
                  key={doctor.id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.roomNumber}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'h-3 w-3 rounded-full',
                        doctor.available ? 'bg-medical-green' : 'bg-muted'
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Waiting</span>
                    <span className="font-bold text-lg">{waiting}</span>
                  </div>
                  {current && (
                    <div className="mt-2 rounded-lg bg-primary/10 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Now Serving</p>
                      <p className="font-mono font-bold">{current.tokenNumber}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recently Called */}
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-bold mb-4">Recently Called</h3>
            <div className="space-y-2">
              {recentlyCalled.map((token, index) => (
                <div
                  key={token.id}
                  className={cn(
                    'flex items-center justify-between rounded-lg p-3 transition-all',
                    index === 0
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-secondary/50'
                  )}
                >
                  <span
                    className={cn(
                      'font-mono font-bold',
                      index === 0 ? 'text-lg' : 'text-base'
                    )}
                  >
                    {token.tokenNumber}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {token.calledAt
                      ? new Date(token.calledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Waiting List Ticker */}
      <div className="mt-8 rounded-2xl border bg-card p-6">
        <h3 className="text-lg font-bold mb-4">Waiting</h3>
        <div className="flex flex-wrap gap-3">
          {tokens
            .filter((t) => t.status === 'waiting' || t.status === 'urgent')
            .sort((a, b) => {
              if (a.status === 'urgent' && b.status !== 'urgent') return -1;
              if (b.status === 'urgent' && a.status !== 'urgent') return 1;
              return a.position - b.position;
            })
            .map((token) => (
              <div
                key={token.id}
                className={cn(
                  'rounded-lg border-2 px-4 py-2 font-mono font-bold',
                  token.status === 'urgent'
                    ? 'border-status-urgent bg-status-urgent/10 text-status-urgent'
                    : 'border-border bg-secondary'
                )}
              >
                {token.tokenNumber}
              </div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Please keep your token ready. Listen for your number.</p>
      </footer>
    </div>
  );
}
