import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueueGrid } from '@/components/common/QueueGrid';
import { mockQueueTokens } from '@/data/mockData';
import { QueueToken } from '@/types';
import { Clock, Users, AlertCircle, Play, User, Stethoscope, UserCircle2, Activity } from 'lucide-react';
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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Patient Queue</h1>
          <p className="text-muted-foreground">Real-time patient queue - Updated live</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-9 px-3">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </Badge>
          <Button
            onClick={() => waitingTokens[0] && handleCallPatient(waitingTokens[0])}
            disabled={waitingTokens.length === 0 || inRoomTokens.length > 0}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Call Next Patient
          </Button>
        </div>
      </div>

      {/* Now Serving Section - Prominent and Clean */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-50/80 to-blue-50/80 dark:from-green-950/20 dark:to-blue-950/20 border-b">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Doctor Consultation</CardTitle>
                <CardDescription className="text-sm">Currently in consultation</CardDescription>
              </div>
            </div>
          </CardHeader>
        </div>
        
        <CardContent className="p-6">
          {inRoomTokens.length > 0 ? (
            <div className="space-y-4">
              {inRoomTokens.map((token) => (
                <div
                  key={token.id}
                  className="relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/10 dark:to-blue-950/10 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800"
                >
                  {/* Subtle pulse animation indicator */}
                  <div className="absolute top-4 right-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Patient Icon */}
                    <div className="flex-shrink-0">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-green-300 dark:border-green-700 shadow-sm">
                        <UserCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-3xl font-bold text-green-700 dark:text-green-400 font-mono tracking-tight">
                          {token.tokenNumber}
                        </h3>
                        <Badge className="bg-green-600 dark:bg-green-700 text-white text-xs px-2 py-0.5">
                          Active
                        </Badge>
                      </div>
                      <p className="text-lg font-medium text-foreground truncate">{token.patientName}</p>
                      <p className="text-sm text-muted-foreground">Currently in consultation</p>
                    </div>

                    {/* Action Button */}
                    <div>
                      <Button
                        onClick={() => handleComplete(token)}
                        size="lg"
                        variant="outline"
                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2"
                      >
                        Complete Consultation
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-3">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No patient in consultation</p>
              <p className="text-xs text-muted-foreground mt-1">Call the next patient to begin</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Waiting Queue Section - Clean Grid Layout */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Waiting Queue</CardTitle>
                <CardDescription className="text-sm">
                  {waitingTokens.length} patient{waitingTokens.length !== 1 ? 's' : ''} waiting
                </CardDescription>
              </div>
            </div>
            {tokens.filter((t) => t.status === 'urgent').length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {tokens.filter((t) => t.status === 'urgent').length} Urgent
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {waitingTokens.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {waitingTokens.map((token, index) => (
                <div
                  key={token.id}
                  className={cn(
                    'group relative bg-white dark:bg-gray-900 rounded-xl p-5 transition-all duration-200',
                    'border-2 hover:shadow-md',
                    token.status === 'urgent'
                      ? 'border-red-200 dark:border-red-900 hover:border-red-300 dark:hover:border-red-800'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800'
                  )}
                >
                  {/* Urgent indicator - subtle and small */}
                  {token.status === 'urgent' && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-red-600 text-white text-xs px-2 py-0.5 shadow-sm">
                        URGENT
                      </Badge>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="flex flex-col items-center text-center space-y-3">
                    {/* Patient Icon */}
                    <div className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
                      token.status === 'urgent'
                        ? 'bg-red-50 dark:bg-red-950/30'
                        : 'bg-gray-100 dark:bg-gray-800'
                    )}>
                      <UserCircle2 className={cn(
                        'h-8 w-8',
                        token.status === 'urgent'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                      )} />
                    </div>

                    {/* Token Number */}
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                        {token.tokenNumber}
                      </p>
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {token.patientName}
                      </p>
                    </div>

                    {/* Wait Time */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>~{token.estimatedWaitTime} min wait</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full pt-2">
                      <Button
                        onClick={() => handleCallPatient(token)}
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={inRoomTokens.length > 0}
                      >
                        Call
                      </Button>
                      {token.status !== 'urgent' && (
                        <Button
                          onClick={() => handleMarkUrgent(token)}
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400"
                        >
                          Urgent
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-3">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No patients in queue</p>
              <p className="text-xs text-muted-foreground mt-1">Queue is empty</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
