import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/common/MetricCard';
import { QueueGrid } from '@/components/common/QueueGrid';
import { mockQueueTokens, mockDoctors, mockPatients } from '@/data/mockData';
import { QueueToken } from '@/types';
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  UserPlus,
  ListOrdered,
  Pill,
  Receipt,
  Package,
  TrendingUp,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ReceptionDashboard() {
  const [tokens, setTokens] = useState<QueueToken[]>(mockQueueTokens);

  const waitingCount = tokens.filter((t) => t.status === 'waiting').length;
  const inRoomCount = tokens.filter((t) => t.status === 'in-room').length;
  const urgentCount = tokens.filter((t) => t.status === 'urgent').length;
  const completedToday = 12; // Mock

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
    toast({
      title: 'Marked Urgent',
      description: `${token.tokenNumber} marked as urgent`,
    });
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
    toast({
      title: 'Completed',
      description: `${token.tokenNumber} consultation completed`,
    });
  };

  const activeTokens = tokens.filter(
    (t) => t.status === 'waiting' || t.status === 'in-room' || t.status === 'urgent'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reception Dashboard</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/reception/register">
              <UserPlus className="h-4 w-4 mr-2" />
              Register Patient
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/reception/queue">
              <ListOrdered className="h-4 w-4 mr-2" />
              Full Queue
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Waiting"
          value={waitingCount}
          subtitle="In queue"
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="In Consultation"
          value={inRoomCount}
          subtitle="Being served"
          icon={Users}
          variant="primary"
        />
        <MetricCard
          title="Urgent"
          value={urgentCount}
          subtitle="Priority patients"
          icon={AlertCircle}
          variant="default"
        />
        <MetricCard
          title="Completed Today"
          value={completedToday}
          subtitle="+3 from yesterday"
          icon={CheckCircle}
          variant="success"
          trend={{ value: 8, positive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/reception/register">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-blue/20">
                <UserPlus className="h-6 w-6 text-medical-blue" />
              </div>
              <div>
                <p className="font-semibold">Register Patient</p>
                <p className="text-sm text-muted-foreground">Walk-in registration</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/reception/dispense">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-green/20">
                <Pill className="h-6 w-6 text-medical-green" />
              </div>
              <div>
                <p className="font-semibold">Dispense Drugs</p>
                <p className="text-sm text-muted-foreground">Fill prescriptions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/reception/billing">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-orange/20">
                <Receipt className="h-6 w-6 text-medical-orange" />
              </div>
              <div>
                <p className="font-semibold">POS / Billing</p>
                <p className="text-sm text-muted-foreground">Process payments</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/inventory">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-violet/20">
                <Package className="h-6 w-6 text-medical-violet" />
              </div>
              <div>
                <p className="font-semibold">Inventory</p>
                <p className="text-sm text-muted-foreground">Check stock levels</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Active Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Queue</CardTitle>
            <CardDescription>
              {activeTokens.length} patients currently in queue
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/reception/queue">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {activeTokens.length > 0 ? (
            <QueueGrid
              tokens={activeTokens.slice(0, 6)}
              showActions
              columns={3}
              onCall={handleCallPatient}
              onMarkUrgent={handleMarkUrgent}
              onSkip={handleSkip}
              onComplete={handleComplete}
            />
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Clock className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="font-medium">No patients in queue</p>
              <p className="text-sm text-muted-foreground">
                Register a new patient to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts & Stats */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-medical-orange" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border p-3 bg-medical-yellow/10 border-medical-yellow/30">
              <Package className="h-5 w-5 text-medical-orange" />
              <div>
                <p className="font-medium">Low Stock Alert</p>
                <p className="text-sm text-muted-foreground">Omeprazole 20mg - 45 units left</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">2 Online Reservations</p>
                <p className="text-sm text-muted-foreground">Pending confirmation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Status */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      doctor.available ? 'bg-medical-green' : 'bg-muted'
                    }`}
                  />
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{doctor.roomNumber}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
