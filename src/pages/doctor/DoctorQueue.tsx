import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockQueueTokens } from '@/data/mockData';
import DoctorConsultation from './DoctorConsultation';
import { QueueToken } from '@/types';
import { Clock, Users, AlertCircle, Play, User, Stethoscope, PhoneCall, AlertTriangle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function DoctorQueue() {
  const [tokens, setTokens] = useState<QueueToken[]>(
    mockQueueTokens.filter((t) => t.doctorId === 'D001')
  );
  const [activeConsultationTokenId, setActiveConsultationTokenId] = useState<string | null>(null);
  const activeConsultationToken = tokens.find((t) => t.id === activeConsultationTokenId) || null;

  const formatRelativeTime = (date?: Date) => {
    if (!date) return '—';
    const diffMs = Date.now() - date.getTime();
    if (diffMs < 0) return '—';
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  const waitingTokens = tokens.filter(
    (t) => t.status === 'waiting' || t.status === 'urgent'
  );
  const inRoomTokens = tokens.filter((t) => t.status === 'in-room');

  const handleCallPatient = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) =>
        t.id === token.id
          ? { ...t, status: 'in-room', calledAt: new Date(), consultationCompleted: false }
          : t
      )
    );
    toast({
      title: 'Patient Called',
      description: `Calling ${token.patientName} (${token.tokenNumber})`,
    });
  };

  const handleMarkUrgent = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, status: 'urgent' } : t))
    );
  };

  const handleSkip = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, status: 'skipped' } : t))
    );
  };

  const handleStartConsultation = (token: QueueToken) => {
    setActiveConsultationTokenId(token.id);
  };

  const handleConsultationComplete = (tokenId: string) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, consultationCompleted: true } : t))
    );
    setActiveConsultationTokenId(null);
  };

  const handleComplete = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, status: 'completed' } : t))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Queue</h1>
          <p className="text-muted-foreground">View and manage your patient queue</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-waiting/20">
              <Clock className="h-6 w-6 text-status-waiting" />
            </div>
            <div>
              <p className="text-2xl font-bold">{waitingTokens.length}</p>
              <p className="text-sm text-muted-foreground">Waiting</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-inroom/20">
              <Users className="h-6 w-6 text-status-inroom" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inRoomTokens.length}</p>
              <p className="text-sm text-muted-foreground">In Room</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-urgent/20">
              <AlertCircle className="h-6 w-6 text-status-urgent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {tokens.filter((t) => t.status === 'urgent').length}
              </p>
              <p className="text-sm text-muted-foreground">Urgent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Queue Status
              </CardTitle>
              <CardDescription>Real-time patient queue - Updated live</CardDescription>
            </div>
            <Badge variant="outline" className="animate-pulse">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {waitingTokens.length > 0 || inRoomTokens.length > 0 ? (
            <>
              {/* Now Serving */}
              {inRoomTokens.length > 0 ? (
                inRoomTokens.slice(0, 1).map((token) => (
                  <section key={token.id} className="mb-8">
                    <div className="min-h-[168px] rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-6 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/15">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-5">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl">
                            <iframe src="https://lottie.host/embed/e9f8a780-729d-4fe8-b193-0d7a8274944a/8iSPVWbLl6.lottie"></iframe>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">Now Serving</p>
                              <Badge
                                variant="secondary"
                                className="border border-emerald-200 bg-emerald-100/70 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/30 dark:text-emerald-200"
                              >
                                <span className="relative mr-2 inline-flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50" />
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                                </span>
                                In consultation
                              </Badge>
                            </div>

                            <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
                              <p className="text-4xl font-bold tracking-tight text-foreground">{token.tokenNumber}</p>
                              <p className="min-w-0 truncate text-base font-medium text-muted-foreground">
                                {token.patientName}
                              </p>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-emerald-700/80 dark:text-emerald-300/80" />
                                <span>
                                  Called {token.calledAt ? token.calledAt.toLocaleTimeString() : '—'}
                                  <span className="ml-2">({formatRelativeTime(token.calledAt)})</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-emerald-700/80 dark:text-emerald-300/80" />
                                <span>Position #{token.position}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                          {token.consultationCompleted ? (
                            <Button onClick={() => handleComplete(token)} size="sm">
                              Complete Visit
                            </Button>
                          ) : activeConsultationTokenId === token.id ? (
                            <Button onClick={() => setActiveConsultationTokenId(null)} variant="outline" size="sm">
                              <X className="h-4 w-4 mr-2" />
                              Cancel Consultation
                            </Button>
                          ) : (
                            <Button onClick={() => handleStartConsultation(token)} size="sm">
                              Start Consultation
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Inline Consultation Form */}
                    {activeConsultationTokenId === token.id && (
                      <div className="mt-6 rounded-xl border-2 border-blue-200 bg-blue-50/30 p-6 shadow-md dark:border-blue-900/40 dark:bg-blue-900/10">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">Active Consultation</h3>
                            <p className="text-sm text-muted-foreground">
                              {token.patientName} • Token {token.tokenNumber}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveConsultationTokenId(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Close
                          </Button>
                        </div>
                        <DoctorConsultation
                          onComplete={() => handleConsultationComplete(token.id)}
                        />
                      </div>
                    )}
                  </section>
                ))
              ) : (
                <section className="mb-8">
                  <div className="min-h-[168px] rounded-2xl border border-dashed border-border bg-muted/10 p-6 shadow-sm">
                    <div className="flex h-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-5">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                          <Stethoscope className="h-9 w-9" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">Now Serving</p>
                            <Badge variant="secondary" className="border border-border bg-muted text-muted-foreground">
                              Waiting
                            </Badge>
                          </div>

                          <div className="mt-2 space-y-2">
                            <div className="h-9 w-40 rounded-md bg-muted animate-pulse" />
                            <div className="h-4 w-64 max-w-full rounded-md bg-muted/70 animate-pulse" />
                          </div>

                          <p className="mt-3 text-sm text-muted-foreground">
                            Room is ready. Call the next patient to start consultation.
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => waitingTokens[0] && handleCallPatient(waitingTokens[0])}
                        disabled={waitingTokens.length === 0}
                        className="sm:min-w-[240px]"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {waitingTokens.length > 0 ? (
                          <span className="flex flex-col items-start">
                            <span className="text-xs opacity-80">Call Next Patient</span>
                            <span className="font-semibold">{waitingTokens[0].tokenNumber} • {waitingTokens[0].patientName}</span>
                          </span>
                        ) : (
                          'Call Next Patient'
                        )}
                      </Button>
                    </div>
                  </div>
                </section>
              )}

              {/* Waiting Queue - Hidden during active consultation */}
              {!activeConsultationTokenId && ((inRoomTokens.length > 0 ? [...waitingTokens] : waitingTokens.slice(1))).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <p className="font-semibold text-lg">Waiting Queue</p>
                    <Badge variant="secondary">
                      {(inRoomTokens.length > 0 ? waitingTokens.length : waitingTokens.length - 1)} waiting
                    </Badge>
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {(inRoomTokens.length > 0 ? waitingTokens : waitingTokens.slice(1)).map((token, index) => {
                      const queuePosition = inRoomTokens.length > 0 ? index + 2 : index + 2;
                      const isUrgent = token.status === 'urgent';

                      return (
                        <article
                          key={token.id}
                          className={cn(
                            'group relative flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md',
                            isUrgent
                              ? 'border-amber-400/70 bg-amber-50/30 dark:border-amber-500/50 dark:bg-amber-900/10'
                              : 'border-border/80'
                          )}
                        >
                          {/* Left strip (subtle status cue) */}
                          <div
                            className={cn(
                              'h-12 w-1.5 shrink-0 rounded-full',
                              isUrgent ? 'bg-amber-500/80' : 'bg-muted'
                            )}
                            aria-hidden="true"
                          />

                          {/* Token + position */}
                          <div className="flex min-w-0 flex-col items-center">
                            <div
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold',
                                isUrgent
                                  ? 'border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700/60 dark:bg-amber-900/30 dark:text-amber-100'
                                  : 'border-border bg-muted text-foreground'
                              )}
                              title="Queue position"
                            >
                              {queuePosition}
                            </div>
                            <p className="mt-2 text-lg font-semibold tracking-wide text-foreground">
                              {token.tokenNumber}
                            </p>
                          </div>

                          {/* Patient + wait */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <p className="min-w-0 truncate text-sm font-medium text-foreground">
                                {token.patientName}
                              </p>
                              {isUrgent && (
                                <Badge className="ml-auto bg-amber-500 text-white shadow-sm">Urgent</Badge>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Est. {token.estimatedWaitTime} min</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => handleCallPatient(token)}
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 rounded-full border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Call patient"
                              aria-label="Call patient"
                            >
                              <PhoneCall className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                            </Button>

                            {!isUrgent && (
                              <Button
                                onClick={() => handleMarkUrgent(token)}
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 rounded-full border border-border/70 hover:border-amber-500/70 hover:bg-amber-50/60 dark:hover:bg-amber-900/20"
                                title="Mark as urgent"
                                aria-label="Mark as urgent"
                              >
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              </Button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Queue is empty</p>
              <p className="text-muted-foreground">No patients waiting</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Show message when consultation is active */}
      {activeConsultationTokenId && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-900/10">
          <CardContent className="flex items-center justify-center gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Waiting queue hidden during active consultation. Complete or cancel the consultation to view waiting patients.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
