import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/common/MetricCard';
import { Badge } from '@/components/ui/badge';
import { mockConsultations, mockDrugs } from '@/data/mockData';
import {
  Users,
  TrendingUp,
  Pill,
  Clock,
  BarChart3,
  Calendar,
} from 'lucide-react';

export default function DoctorAnalytics() {
  const totalPatients = 156;
  const thisMonth = 24;
  const avgConsultTime = 12;

  // Count drug prescriptions
  const drugCounts = mockConsultations
    .flatMap((c) => c.prescriptions)
    .reduce((acc, rx) => {
      acc[rx.drugName] = (acc[rx.drugName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topDrugs = Object.entries(drugCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Your performance metrics and insights</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Patients"
          value={totalPatients}
          subtitle="All time"
          icon={Users}
          variant="primary"
        />
        <MetricCard
          title="This Month"
          value={thisMonth}
          subtitle="Consultations"
          icon={Calendar}
          variant="success"
          trend={{ value: 12, positive: true }}
        />
        <MetricCard
          title="Avg. Consult Time"
          value={`${avgConsultTime} min`}
          subtitle="Per patient"
          icon={Clock}
          variant="accent"
        />
        <MetricCard
          title="Prescriptions"
          value={mockConsultations.flatMap((c) => c.prescriptions).length}
          subtitle="Medications prescribed"
          icon={Pill}
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Patients Seen
            </CardTitle>
            <CardDescription>Daily consultation trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg border-2 border-dashed flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Patient volume chart</p>
                <p className="text-sm">Connect to backend for live data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Prescribed Drugs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Prescribed
            </CardTitle>
            <CardDescription>Your frequently prescribed medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDrugs.length > 0 ? (
                topDrugs.map(([drug, count], index) => (
                  <div key={drug} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{drug}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{count} times</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Pill className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No prescription data yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Diagnoses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Diagnoses</CardTitle>
            <CardDescription>Your latest patient diagnoses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockConsultations.slice(0, 5).map((consult) => (
                <div
                  key={consult.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{consult.diagnosis}</p>
                    <p className="text-sm text-muted-foreground">{consult.symptoms}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(consult.createdAt).toLocaleDateString()}
                    </p>
                    <Badge variant="outline">{consult.prescriptions.length} drugs</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
