import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MetricCard } from '@/components/common/MetricCard';
import { mockConsultations } from '@/data/mockData';
import {
  Clock,
  Calendar,
  FileText,
  Pill,
  User,
  ChevronRight,
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Patient'}</h1>
        <p className="text-muted-foreground">Manage your appointments and health records</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Upcoming"
          value="1"
          subtitle="Appointments"
          icon={Calendar}
          variant="primary"
        />
        <MetricCard
          title="Prescriptions"
          value="3"
          subtitle="Active medications"
          icon={Pill}
          variant="accent"
        />
        <MetricCard
          title="Consultations"
          value={mockConsultations.length}
          subtitle="Total visits"
          icon={FileText}
          variant="default"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/patient/reserve">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-blue/20">
                <Clock className="h-6 w-6 text-medical-blue" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Reserve Queue</p>
                <p className="text-sm text-muted-foreground">Book your spot online</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/patient/history">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-violet/20">
                <Pill className="h-6 w-6 text-medical-violet" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Prescriptions</p>
                <p className="text-sm text-muted-foreground">View past medications</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Consultations</CardTitle>
          <CardDescription>Your recent visits and prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {mockConsultations.length > 0 ? (
            <div className="space-y-3">
              {mockConsultations.map((consult) => (
                <div key={consult.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{consult.diagnosis}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(consult.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">No consultations yet</p>
              <p className="text-sm text-muted-foreground">Your visit history will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
