import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueueGrid } from '@/components/common/QueueGrid';
import { mockQueueTokens, mockDoctors, generateTokenNumber } from '@/data/mockData';
import { QueueToken } from '@/types';
import {
  Clock,
  Users,
  AlertCircle,
  Volume2,
  RefreshCw,
  Plus,
  Filter,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ReceptionQueue() {
  const [tokens, setTokens] = useState<QueueToken[]>(mockQueueTokens);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [newPatientId, setNewPatientId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newQueueType, setNewQueueType] = useState<'opd' | 'specialist'>('opd');

  const filteredTokens =
    selectedDoctor === 'all'
      ? tokens
      : tokens.filter((t) => t.doctorId === selectedDoctor);

  const waitingTokens = filteredTokens.filter(
    (t) => t.status === 'waiting' || t.status === 'urgent'
  );
  const inRoomTokens = filteredTokens.filter((t) => t.status === 'in-room');
  const completedTokens = filteredTokens.filter(
    (t) => t.status === 'completed' || t.status === 'skipped'
  );

  const handleCallPatient = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) =>
        t.id === token.id ? { ...t, status: 'in-room', calledAt: new Date() } : t
      )
    );
    // Play sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {});
    toast({
      title: 'Patient Called',
      description: `Calling ${token.patientName} (${token.tokenNumber})`,
    });
  };

  const handleMarkUrgent = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, status: 'urgent', position: 0 } : t))
    );
    toast({
      title: 'Marked Urgent',
      description: `${token.tokenNumber} marked as urgent and moved to front`,
    });
  };

  const handleSkip = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, status: 'skipped' } : t))
    );
    toast({
      title: 'Patient Skipped',
      description: `${token.tokenNumber} has been skipped`,
    });
  };

  const handleComplete = (token: QueueToken) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, status: 'completed' } : t))
    );
    toast({
      title: 'Consultation Complete',
      description: `${token.tokenNumber} consultation completed`,
    });
  };

  const handleIssueToken = () => {
    if (!newPatientId || !newPatientName) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const newToken: QueueToken = {
      id: `T${Date.now()}`,
      tokenNumber: generateTokenNumber(newQueueType),
      patientId: newPatientId,
      patientName: newPatientName,
      status: 'waiting',
      queueType: newQueueType,
      doctorId: 'D001',
      doctorName: 'Dr. Emily Chen',
      estimatedWaitTime: waitingTokens.length * 15,
      position: waitingTokens.length + 1,
      createdAt: new Date(),
    };

    setTokens((prev) => [...prev, newToken]);
    setIsIssueDialogOpen(false);
    setNewPatientId('');
    setNewPatientName('');

    toast({
      title: 'Token Issued',
      description: `Token ${newToken.tokenNumber} issued for ${newPatientName}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Queue Management</h1>
          <p className="text-muted-foreground">
            Manage patient queue and consultations
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Issue Token
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Issue New Token</DialogTitle>
                <DialogDescription>
                  Create a new queue token for a patient
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient ID</label>
                  <Input
                    placeholder="Enter Patient ID"
                    value={newPatientId}
                    onChange={(e) => setNewPatientId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient Name</label>
                  <Input
                    placeholder="Enter Patient Name"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Queue Type</label>
                  <Select
                    value={newQueueType}
                    onValueChange={(v) => setNewQueueType(v as 'opd' | 'specialist')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="opd">General OPD</SelectItem>
                      <SelectItem value="specialist">Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleIssueToken}>
                  Issue Token
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
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
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-completed/20">
              <Volume2 className="h-6 w-6 text-status-completed" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedTokens.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter by doctor:</span>
        <div className="flex gap-2">
          <Badge
            variant={selectedDoctor === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedDoctor('all')}
          >
            All
          </Badge>
          {mockDoctors.map((doctor) => (
            <Badge
              key={doctor.id}
              variant={selectedDoctor === doctor.id ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedDoctor(doctor.id)}
            >
              {doctor.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Queue Tabs */}
      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waiting">
            Waiting ({waitingTokens.length})
          </TabsTrigger>
          <TabsTrigger value="in-room">
            In Room ({inRoomTokens.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTokens.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waiting">
          {waitingTokens.length > 0 ? (
            <QueueGrid
              tokens={waitingTokens}
              showActions
              columns={3}
              onCall={handleCallPatient}
              onMarkUrgent={handleMarkUrgent}
              onSkip={handleSkip}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No patients waiting</p>
                <p className="text-muted-foreground">Queue is empty</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in-room">
          {inRoomTokens.length > 0 ? (
            <QueueGrid
              tokens={inRoomTokens}
              showActions
              columns={3}
              onComplete={handleComplete}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No active consultations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedTokens.length > 0 ? (
            <QueueGrid tokens={completedTokens} columns={4} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium">No completed consultations yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
