import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { mockQueueTokens } from '@/data/mockData';
import { QueueToken } from '@/types';
import {
  Users,
  AlertCircle,
  TrendingUp,
  Eye,
  EyeOff,
  Activity,
  Pill,
  Play,
  ChevronRight,
  Clock,
  CheckCircle2,
  Hourglass,
  AlertTriangle,
  Package,
  TrendingDown,
  Bell,
  BellOff,
  Check,
  X,
  User,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data for analytics
const incomeData = [
  { day: 'Dec 1', income: 8500 },
  { day: 'Dec 2', income: 12000 },
  { day: 'Dec 3', income: 9500 },
  { day: 'Dec 4', income: 14000 },
  { day: 'Dec 5', income: 11000 },
  { day: 'Dec 6', income: 13500 },
  { day: 'Dec 7', income: 10500 },
  { day: 'Dec 8', income: 15000 },
  { day: 'Dec 9', income: 12500 },
  { day: 'Dec 10', income: 9000 },
  { day: 'Dec 11', income: 11500 },
  { day: 'Dec 12', income: 13000 },
  { day: 'Dec 13', income: 14500 },
  { day: 'Dec 14', income: 12000 },
  { day: 'Dec 15', income: 16000 },
  { day: 'Dec 16', income: 13500 },
];

const diseaseData = [
  { name: 'Common Cold', value: 45, cases: 45, color: '#3b82f6', percentage: 31.0 },
  { name: 'Fever', value: 32, cases: 32, color: '#ef4444', percentage: 22.1 },
  { name: 'Gastroenteritis', value: 28, cases: 28, color: '#f59e0b', percentage: 19.3 },
  { name: 'Hypertension', value: 21, cases: 21, color: '#8b5cf6', percentage: 14.5 },
  { name: 'Diabetes', value: 18, cases: 18, color: '#10b981', percentage: 12.4 },
];

const lowStockMedicines = [
  { name: 'Paracetamol 500mg', stock: 12, minStock: 50, status: 'critical' },
  { name: 'Amoxicillin 250mg', stock: 8, minStock: 30, status: 'critical' },
  { name: 'Metformin 500mg', stock: 22, minStock: 40, status: 'low' },
  { name: 'Atorvastatin 10mg', stock: 15, minStock: 30, status: 'low' },
  { name: 'Omeprazole 20mg', stock: 5, minStock: 25, status: 'critical' },
  { name: 'Aspirin 75mg', stock: 18, minStock: 40, status: 'low' },
  { name: 'Ibuprofen 400mg', stock: 10, minStock: 35, status: 'critical' },
  { name: 'Losartan 50mg', stock: 20, minStock: 30, status: 'low' },
  { name: 'Amlodipine 5mg', stock: 14, minStock: 35, status: 'low' },
  { name: 'Clopidogrel 75mg', stock: 7, minStock: 20, status: 'critical' },
];

// Custom Sri Lankan Rupee Icon Component
const SriLankanRupeeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="14"
      fontWeight="bold"
      fill="currentColor"
      stroke="none"
    >
      LKR
    </text>
  </svg>
);

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [showIncome, setShowIncome] = useState(false);
  const tokens = mockQueueTokens.filter((t) => t.doctorId === 'D001');

  // Alert notifications state
  const [alerts, setAlerts] = useState(
    lowStockMedicines.map((med, idx) => ({
      id: idx,
      ...med,
      isRead: false,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    }))
  );

  const unreadCount = alerts.filter(a => !a.isRead).length;

  // Calculations
  const waitingTokens = tokens.filter((t) => t.status === 'waiting');
  const urgentTokens = tokens.filter((t) => t.status === 'urgent');
  const completedTokens = tokens.filter((t) => t.status === 'completed');

  const totalPatientsToday = 24;
  const completedToday = completedTokens.length + 8;
  const totalInQueue = waitingTokens.length + urgentTokens.length;
  const urgentCount = urgentTokens.length;

  const avgConsultationTime = 12; // minutes
  const estimatedTimeForQueue = totalInQueue * avgConsultationTime;
  const estimatedHours = Math.floor(estimatedTimeForQueue / 60);
  const estimatedMinutes = estimatedTimeForQueue % 60;

  const todayIncome = 13500;
  const totalCases = diseaseData.reduce((sum, disease) => sum + disease.cases, 0);

  const handleCallNext = () => {
    const nextToken = [...urgentTokens, ...waitingTokens][0];
    if (nextToken) {
      toast({
        title: 'Patient Called',
        description: `Calling ${nextToken.patientName} - ${nextToken.tokenNumber}`,
      });
      navigate('/doctor/consultation');
    }
  };

  const handleSelectPatient = (token: QueueToken) => {
    toast({
      title: 'Patient Selected',
      description: `${token.patientName} - ${token.tokenNumber}`,
    });
    navigate('/doctor/consultation');
  };

  // Alert management functions
  const markAsRead = (id: number) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
    toast({
      title: 'Alert Marked as Read',
      description: 'Notification has been marked as read',
    });
  };

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: 'Alert Dismissed',
      description: 'Notification has been removed',
    });
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
    toast({
      title: 'All Alerts Read',
      description: 'All notifications marked as read',
    });
  };

  // Sort queue: urgent patients first, then waiting patients
  const sortedQueue = [...urgentTokens, ...waitingTokens];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Dr. Emily Chen - General Medicine</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCallNext} disabled={sortedQueue.length === 0}>
            <Play className="h-4 w-4 mr-2" />
            Call Next Patient
          </Button>
        </div>
      </div>

      {/* Patient Details - Today's Overview */}
      <Card className="border border-slate-200/60 dark:border-slate-700/60 shadow-lg bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100/60 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-blue-950/60 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <CardHeader className="relative">
          <CardTitle className="text-xl">Patient Details - Today's Overview</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {/* Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Patients Visited */}
            <div className="group relative overflow-hidden rounded-xl border border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-slate-900 shadow-sm hover:shadow-md transition-all">
              {/* Watermark Icon */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 animate-blink">
                <Users className="h-32 w-32 text-blue-600" />
              </div>
              <div className="relative p-5">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Patients Visited</p>
                <p className="text-3xl font-bold text-blue-600">{totalPatientsToday}</p>
              </div>
            </div>

            {/* Completed */}
            <div className="group relative overflow-hidden rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-slate-900 shadow-sm hover:shadow-md transition-all">
              {/* Watermark Icon */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 animate-blink">
                <CheckCircle2 className="h-32 w-32 text-emerald-600" />
              </div>
              <div className="relative p-5">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Completed</p>
                <p className="text-3xl font-bold text-emerald-600">{completedToday}</p>
              </div>
            </div>

            {/* In Queue */}
            <div className="group relative overflow-hidden rounded-xl border border-orange-200/50 dark:border-orange-700/50 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-slate-900 shadow-sm hover:shadow-md transition-all">
              {/* Watermark Icon */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 animate-blink">
                <Clock className="h-32 w-32 text-orange-600" />
              </div>
              <div className="relative p-5">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">In Queue</p>
                <p className="text-3xl font-bold text-orange-600">{totalInQueue}</p>
              </div>
            </div>

            {/* Urgent */}
            <div className="group relative overflow-hidden rounded-xl border border-red-200/50 dark:border-red-700/50 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-slate-900 shadow-sm hover:shadow-md transition-all">
              {/* Watermark Icon */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 animate-blink">
                <AlertTriangle className="h-32 w-32 text-red-600" />
              </div>
              <div className="relative p-5">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Urgent</p>
                <p className="text-3xl font-bold text-red-600">{urgentCount}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Avg. Consultation Time */}
              <div className="flex items-center gap-3">
                <img src="/hourglass.gif" alt="Loading" className="h-10 w-10" />                
                <span className="text-sm font-medium">Avg. Consultation Time:</span>
                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700">
                  {avgConsultationTime} min
                </Badge>
              </div>

              {/* Estimated Completion */}
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Estimated Completion:</span>
                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700">
                  {estimatedHours}h {estimatedMinutes}m
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Left Column - Charts & Analytics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Income Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Today's Income</CardTitle>
              <div className="flex items-center gap-2">
                <SriLankanRupeeIcon className="h-7 w-7 text-green-600 pb-1"  />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowIncome(!showIncome)}
                >
                  {showIncome ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {showIncome ? `Rs ${todayIncome.toLocaleString()}` : '••••••'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Revenue generated today</p>
            </CardContent>
          </Card>

          {/* Income Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Income Trend
              </CardTitle>
              <CardDescription>Daily income over the last 16 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(value) => `Rs ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 min-w-[180px]">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {payload[0].payload.day}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Daily Income
                              </p>
                              <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                                Rs {payload[0].value?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{
                      fill: '#10b981',
                      strokeWidth: 2,
                      stroke: '#fff',
                      r: 4
                    }}
                    activeDot={{
                      r: 6,
                      fill: '#10b981',
                      stroke: '#fff',
                      strokeWidth: 2
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top 5 Diseases - Professional Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Top 5 Diseases This Week
              </CardTitle>
              <CardDescription>Disease distribution and case analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={diseaseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {diseaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [`${value} cases`, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {diseaseData.map((disease, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: disease.color }}
                        />
                        <span className="text-sm font-medium">{disease.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {disease.value} cases
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts - Enhanced Notification System */}
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <CardTitle>Stock Alerts</CardTitle>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark All Read
                  </Button>
                )}
              </div>
              <CardDescription>
                {alerts.length} notification{alerts.length !== 1 ? 's' : ''} • {unreadCount} unread
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y flex-1 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BellOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No stock alerts at this time</p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const isCritical = alert.status === 'critical';
                  const timeAgo = new Date(alert.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        'group relative py-3 px-1 transition-all hover:bg-muted/50',
                        alert.isRead && 'opacity-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded flex-shrink-0',
                          alert.isRead
                            ? 'text-muted-foreground'
                            : isCritical
                              ? 'text-red-600'
                              : 'text-amber-600'
                        )}>
                          <AlertCircle className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={cn(
                                  "text-sm font-medium",
                                  alert.isRead && "line-through"
                                )}>{alert.name}</p>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-xs h-5',
                                    alert.isRead
                                      ? 'border-gray-400 text-gray-600'
                                      : isCritical
                                        ? 'border-red-600 text-red-600'
                                        : 'border-amber-600 text-amber-600'
                                  )}
                                >
                                  {isCritical ? 'Critical' : 'Low'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Stock: {alert.stock} / {alert.minStock} units • {timeAgo}
                              </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1">
                              {!alert.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(alert.id)}
                                  className="h-7 w-7 p-0"
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dismissAlert(alert.id)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                title="Dismiss"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Patient Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">Current Queue Status</CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400">Real-time patient queue - Updated live</CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-medical-pulse"></span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
              {sortedQueue.length > 0 ? (
                <>
                  {/* Now Serving Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                        <Stethoscope className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Active</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">In consultation</p>
                      </div>
                    </div>
                    
                    {sortedQueue.slice(0, 1).map((token) => (
                      <div
                        key={token.id}
                        onClick={() => handleSelectPatient(token)}
                        className="relative bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg p-3 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-all animate-medical-breathe"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-700">
                            <User className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-300">{token.tokenNumber}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Now serving</p>
                          </div>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500">
                            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Waiting Queue */}
                  {sortedQueue.length > 1 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700 pt-6">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
                          <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Waiting</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{sortedQueue.length - 1} patient{sortedQueue.length - 1 !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {sortedQueue.slice(1).map((token, index) => (
                          <div
                            key={token.id}
                            onClick={() => handleSelectPatient(token)}
                            className={cn(
                              'group relative rounded-lg border transition-all duration-200 cursor-pointer',
                              token.status === 'urgent'
                                ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-300 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-700'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            )}
                          >
                            <div className="flex items-center gap-2 p-2.5">
                              <div className={cn(
                                'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-semibold text-xs border-2',
                                token.status === 'urgent'
                                  ? 'bg-rose-100 dark:bg-rose-900/30 border-rose-400 dark:border-rose-700 text-rose-700 dark:text-rose-400'
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                              )}>
                                {index + 2}
                              </div>
                              
                              <div className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-full border-2',
                                token.status === 'urgent'
                                  ? 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700'
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                              )}>
                                <User className={cn(
                                  'h-5 w-5',
                                  token.status === 'urgent' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                                )} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className={cn(
                                    'text-sm font-bold font-mono',
                                    token.status === 'urgent' ? 'text-rose-800 dark:text-rose-300' : 'text-slate-800 dark:text-slate-200'
                                  )}>
                                    {token.tokenNumber}
                                  </p>
                                  {token.status === 'urgent' && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900/50 border border-rose-300 dark:border-rose-800">
                                      <span className="h-1 w-1 rounded-full bg-rose-600 dark:bg-rose-400"></span>
                                      <span className="text-xs font-medium text-rose-800 dark:text-rose-300">Priority</span>
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Clock className={cn(
                                    'h-3 w-3',
                                    token.status === 'urgent' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                                  )} />
                                  <span className={cn(
                                    'text-xs',
                                    token.status === 'urgent' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                                  )}>
                                    ~{token.estimatedWaitTime} min
                                  </span>
                                </div>
                              </div>

                              <ChevronRight className={cn(
                                'h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity',
                                token.status === 'urgent' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
                              )} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No patients</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Queue is empty</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
