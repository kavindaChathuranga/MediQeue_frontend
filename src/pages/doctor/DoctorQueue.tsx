import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueueGrid } from '@/components/common/QueueGrid';
import { mockQueueTokens } from '@/data/mockData';
import { QueueToken } from '@/types';
import { Clock, Users, AlertCircle, Play, User, Stethoscope, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function DoctorQueue() {
  const [tokens, setTokens] = useState<QueueToken[]>(
    mockQueueTokens.filter((t) => t.doctorId === 'D001')
  );

  const waitingTokens = tokens.filter(
    (t) => t.status === 'waiting' || t.status === 'urgent'
  );
  const inRoomTokens = tokens.filter((t) => t.status === 'in-room');

  const handleCallPatient = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) =>
        t.id === token.id ? { ...t, status: 'in-room', calledAt: new Date() } : t
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
        <Button
          onClick={() => waitingTokens[0] && handleCallPatient(waitingTokens[0])}
          disabled={waitingTokens.length === 0}
        >
          <Play className="h-4 w-4 mr-2" />
          Call Next
        </Button>
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
              {/* Now Serving Section */}
              {(inRoomTokens.length > 0 ? inRoomTokens : waitingTokens).slice(0, 1).map((token) => (
                <div key={token.id} className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Now Serving</p>
                      <p className="text-sm text-muted-foreground">Currently in consultation</p>
                    </div>
                  </div>
                  
                  <div className="relative bg-gradient-to-r from-green-500/20 to-green-500/10 border-2 border-green-500 rounded-xl p-6 animate-pulse">
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-green-600 text-white shadow-lg animate-bounce">
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/30 border-2 border-green-600 shadow-lg">
                        <User className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-3xl font-bold font-mono text-green-600">{token.tokenNumber}</p>
                        <p className="text-sm text-muted-foreground">{token.patientName} - Token being served</p>
                      </div>
                      <ArrowRight className="h-8 w-8 text-green-600 animate-pulse" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      {token.status !== 'in-room' && (
                        <Button onClick={() => handleCallPatient(token)} size="sm">
                          Call Patient
                        </Button>
                      )}
                      <Button onClick={() => handleComplete(token)} variant="outline" size="sm">
                        Complete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Waiting Queue */}
              {((inRoomTokens.length > 0 ? [...waitingTokens] : waitingTokens.slice(1))).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <p className="font-semibold text-lg">Waiting Queue</p>
                    <Badge variant="secondary">
                      {(inRoomTokens.length > 0 ? waitingTokens.length : waitingTokens.length - 1)} waiting
                    </Badge>
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {(inRoomTokens.length > 0 ? waitingTokens : waitingTokens.slice(1)).map((token, index) => (
                      <div
                        key={token.id}
                        className={cn(
                          'group relative bg-card border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg',
                          token.status === 'urgent'
                            ? 'border-red-500 hover:border-red-600'
                            : 'border-border hover:border-primary'
                        )}
                      >
                        <div className="absolute -top-3 -left-3">
                          <div className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg',
                            token.status === 'urgent'
                              ? 'bg-red-600 text-white'
                              : 'bg-primary text-primary-foreground'
                          )}>
                            #{inRoomTokens.length > 0 ? index + 2 : index + 2}
                          </div>
                        </div>

                        <div className="flex flex-col items-center space-y-3 pt-4">
                          <div className="relative">
                            <User className={cn(
                              'h-12 w-12 transition-colors',
                              token.status === 'urgent' ? 'text-red-600' : 'text-primary/60 group-hover:text-primary'
                            )} />
                          </div>
                          
                          <div className="text-center space-y-1 w-full">
                            <p className="text-lg font-bold font-mono">{token.tokenNumber}</p>
                            <p className="text-sm font-medium">{token.patientName}</p>
                            {token.status === 'urgent' && (
                              <Badge className="bg-red-600 text-white text-xs">URGENT</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              ~{token.estimatedWaitTime}min wait
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 w-full pt-2">
                            <Button onClick={() => handleCallPatient(token)} size="sm" className="flex-1">
                              Call
                            </Button>
                            {token.status !== 'urgent' && (
                              <Button onClick={() => handleMarkUrgent(token)} variant="destructive" size="sm" className="flex-1">
                                Urgent
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
    </div>
  );
}
