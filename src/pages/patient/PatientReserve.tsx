import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDoctors } from '@/data/mockData';
import { Clock, User, CheckCircle, Calendar, AlertCircle, TrendingUp, Users, Stethoscope, ArrowRight, Armchair, Mail, Phone, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QueuePatient {
  id: string;
  tokenNumber: string;
  name: string;
  status: 'waiting' | 'now-serving' | 'completed';
  position: number;
}

export default function PatientReserve() {
  const navigate = useNavigate();
  const [reservedToken, setReservedToken] = useState<{
    number: string;
    position: number;
    estimatedWait: number;
    doctor: string;
    patientName: string;
  } | null>(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  // Patient registration data
  const [patientData, setPatientData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    gender: '',
  });

  // Mock queue data - simulate real-time updates
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>([
    { id: '1', tokenNumber: 'A001', name: 'Sarah Johnson', status: 'now-serving', position: 1 },
    { id: '2', tokenNumber: 'A002', name: 'Michael Chen', status: 'waiting', position: 2 },
    { id: '3', tokenNumber: 'A003', name: 'Emily Davis', status: 'waiting', position: 3 },
    { id: '4', tokenNumber: 'A004', name: 'James Wilson', status: 'waiting', position: 4 },
  ]);

  const availableDoctors = mockDoctors.filter((d) => d.available);
  const currentQueueLength = queuePatients.filter(p => p.status !== 'completed').length;
  const avgWaitTime = 15;

  // TODO: Replace with real API call to fetch queue data
  // useEffect(() => {
  //   const fetchQueueData = async () => {
  //     const response = await fetch('/api/queue');
  //     const data = await response.json();
  //     setQueuePatients(data);
  //   };
  //   fetchQueueData();
  //   // Set up WebSocket or polling for real-time updates
  // }, []);

  const handleReserve = () => {
    // Validate patient data
    if (!patientData.fullName || !patientData.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields (Name and Phone)',
        variant: 'destructive',
      });
      return;
    }

    // Simulate reservation
    const tokenNum = `A${String(currentQueueLength + 1).padStart(3, '0')}`;
    const doctorName = 'Dr. Emily Chen';
    
    setReservedToken({
      number: tokenNum,
      position: currentQueueLength + 1,
      estimatedWait: (currentQueueLength + 1) * avgWaitTime,
      doctor: doctorName,
      patientName: patientData.fullName,
    });

    // Add the patient to the queue
    setQueuePatients([...queuePatients, {
      id: String(queuePatients.length + 1),
      tokenNumber: tokenNum,
      name: patientData.fullName,
      status: 'waiting',
      position: currentQueueLength + 1,
    }]);

    setShowBookingConfirmation(true);

    toast({
      title: 'Queue Reserved Successfully!',
      description: `Your token number is ${tokenNum}`,
    });
  };

  // Queue visualization component
  const QueueVisualization = () => (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5" />
              Live Queue Status
              {showBookingConfirmation && (
                <Badge className="bg-medical-green text-white ml-2">
                  You're in the queue!
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Real-time patient queue visualization</CardDescription>
          </div>
          <Badge variant="outline" className="animate-pulse">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Consultation Room */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-medical-green/20">
              <Stethoscope className="h-5 w-5 text-medical-green" />
            </div>
            <div>
              <p className="font-semibold text-lg">Consultation Room</p>
              <p className="text-sm text-muted-foreground">Dr. Emily Chen</p>
            </div>
          </div>
          
          {/* Now Serving Patient */}
          {queuePatients.filter(p => p.status === 'now-serving').map(patient => (
            <div
              key={patient.id}
              className="relative bg-gradient-to-r from-medical-green/20 to-medical-green/10 border-2 border-medical-green rounded-xl p-6 animate-pulse"
            >
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-medical-green text-white shadow-lg animate-bounce">
                  Now Serving
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-medical-green/30 border-2 border-medical-green shadow-lg">
                  <User className="h-8 w-8 text-medical-green" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold font-mono">{patient.tokenNumber}</p>
                  <p className="text-lg font-semibold">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">In consultation</p>
                </div>
                <ArrowRight className="h-8 w-8 text-medical-green animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Waiting Area */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Armchair className="h-5 w-5 text-primary" />
            <p className="font-semibold text-lg">Waiting Area</p>
            <Badge variant="secondary">{queuePatients.filter(p => p.status === 'waiting').length} waiting</Badge>
          </div>

          {/* Queue Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {queuePatients
              .filter(p => p.status === 'waiting')
              .map((patient, index) => {
                const isMyPosition = showBookingConfirmation && patient.tokenNumber === reservedToken?.number;
                return (
                  <div
                    key={patient.id}
                    className={cn(
                      "group relative bg-card border-2 rounded-xl p-4 transition-all duration-500 ease-in-out hover:shadow-lg hover:scale-105",
                      isMyPosition 
                        ? "border-medical-green bg-gradient-to-br from-medical-green/20 to-medical-green/5 shadow-lg shadow-medical-green/20 animate-pulse" 
                        : "border-border hover:border-primary"
                    )}
                    style={{
                      animation: isMyPosition 
                        ? `slideIn 0.5s ease-out ${index * 0.1}s both, pulse 2s ease-in-out infinite` 
                        : `slideIn 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Position Badge */}
                    <div className="absolute -top-3 -left-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg",
                        isMyPosition 
                          ? "bg-medical-green text-white ring-4 ring-medical-green/30" 
                          : "bg-primary text-primary-foreground"
                      )}>
                        #{patient.position}
                      </div>
                    </div>

                    {/* "You" Badge */}
                    {isMyPosition && (
                      <div className="absolute -top-3 -right-3">
                        <Badge className="bg-medical-green text-white shadow-lg animate-bounce">
                          YOU
                        </Badge>
                      </div>
                    )}

                    {/* Patient Seat */}
                    <div className="flex flex-col items-center space-y-3 pt-4">
                      <div className="relative">
                        <Armchair className={cn(
                          "h-12 w-12 transition-colors",
                          isMyPosition ? "text-medical-green" : "text-primary/60 group-hover:text-primary"
                        )} />
                        <div className={cn(
                          "absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2",
                          isMyPosition ? "border-medical-green" : "border-primary"
                        )}>
                          <User className={cn(
                            "h-4 w-4",
                            isMyPosition ? "text-medical-green" : "text-primary"
                          )} />
                        </div>
                      </div>
                      
                      <div className="text-center space-y-1">
                        <p className={cn(
                          "text-lg font-bold font-mono",
                          isMyPosition && "text-medical-green"
                        )}>{patient.tokenNumber}</p>
                        <p className="font-medium text-sm">{patient.name}</p>
                        <Badge variant={isMyPosition ? "default" : "outline"} className={cn(
                          "text-xs",
                          isMyPosition && "bg-medical-green"
                        )}>
                          <Clock className="h-3 w-3 mr-1" />
                          ~{(patient.position - 1) * avgWaitTime}m
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Empty Seats */}
            {[...Array(Math.max(0, 3 - queuePatients.filter(p => p.status === 'waiting').length))].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-secondary/30 border-2 border-dashed border-muted rounded-xl p-4 flex items-center justify-center opacity-50"
              >
                <div className="text-center space-y-2">
                  <Armchair className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animation Styles */}
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
            }
            50% {
              box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
            }
          }
        `}</style>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">Dr. Emily Chen's Dispensary</span>
              <p className="text-xs text-muted-foreground">Queue Reservation</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Staff Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold">Reserve Your Queue Spot</h1>
            <p className="text-muted-foreground">Fill in your details and secure your place in the queue</p>
          </div>

          {/* Live Queue Visualization */}
          <QueueVisualization />

          {/* Live Queue Status */}
          <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-medical-blue/30 bg-medical-blue/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-blue/20">
              <Users className="h-6 w-6 text-medical-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentQueueLength}</p>
              <p className="text-xs text-muted-foreground">Patients in Queue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-medical-green/30 bg-medical-green/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-green/20">
              <Clock className="h-6 w-6 text-medical-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">~{avgWaitTime}min</p>
              <p className="text-xs text-muted-foreground">Avg Wait Time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-medical-violet/30 bg-medical-violet/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-violet/20">
              <TrendingUp className="h-6 w-6 text-medical-violet" />
            </div>
            <div>
              <p className="text-2xl font-bold">{availableDoctors.length}</p>
              <p className="text-xs text-muted-foreground">Doctors Available</p>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Reservation Form */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {!showBookingConfirmation ? (
            // Before Booking - Reservation Form
            <Card>
              <CardHeader>
                <CardTitle>Reserve Your Queue Spot</CardTitle>
                <CardDescription>Fill in your details to secure your place</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Your Token Preview */}
                <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6">
                  <div className="text-center space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Your Queue Number Will Be</p>
                    <div className="inline-flex items-center justify-center rounded-2xl bg-background/80 border-2 border-primary/50 px-8 py-4 shadow-lg">
                      <p className="text-6xl font-bold font-mono text-primary">A{String(currentQueueLength + 1).padStart(3, '0')}</p>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">#{currentQueueLength + 1}</p>
                        <p className="text-xs text-muted-foreground">Your Position</p>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">~{(currentQueueLength + 1) * avgWaitTime}min</p>
                        <p className="text-xs text-muted-foreground">Wait Time</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Registration Form */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Your Information</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={patientData.fullName}
                        onChange={(e) => setPatientData({ ...patientData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={patientData.phone}
                        onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={patientData.email}
                        onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={patientData.age}
                        onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={patientData.gender} onValueChange={(value) => setPatientData({ ...patientData, gender: value })}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address (Optional)</Label>
                      <Input
                        id="address"
                        placeholder="Street address, City"
                        value={patientData.address}
                        onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="rounded-lg border bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                      <Stethoscope className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Consultation with</p>
                      <p className="text-xl font-bold">Dr. Emily Chen</p>
                      <p className="text-sm text-muted-foreground">General Physician</p>
                    </div>
                    <Badge variant="default" className="bg-medical-green">
                      <span className="flex h-2 w-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
                      Available
                    </Badge>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={handleReserve}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm & Get Token
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  * Required fields. You'll receive instant confirmation with your token number
                </p>
              </CardContent>
            </Card>
          ) : (
            // After Booking - Confirmation Display
            <Card className="border-2 border-medical-green/30 bg-gradient-to-br from-medical-green/5 to-background">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-medical-green/20">
                    <CheckCircle className="h-6 w-6 text-medical-green" />
                  </div>
                  <div>
                    <CardTitle className="text-medical-green">Your Queue Position is Confirmed!</CardTitle>
                    <CardDescription>Your consultation details are ready</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booked Token Display */}
                <div className="rounded-xl border-2 border-medical-green/40 bg-gradient-to-br from-medical-green/20 via-medical-green/10 to-background p-6">
                  <div className="text-center space-y-6">
                    {/* Token Number */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Your Queue Number</p>
                      <div className="inline-flex items-center justify-center rounded-2xl bg-background border-4 border-medical-green/50 px-12 py-6 shadow-xl shadow-medical-green/20">
                        <p className="text-7xl font-bold font-mono text-medical-green tracking-wider">
                          {reservedToken?.number}
                        </p>
                      </div>
                    </div>

                    {/* Position and Wait Time Cards */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="rounded-xl bg-background border-2 border-medical-green/30 p-6 shadow-md">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-green/20">
                            <Users className="h-6 w-6 text-medical-green" />
                          </div>
                          <p className="text-sm text-muted-foreground">Position in Queue</p>
                          <p className="text-4xl font-bold text-medical-green">#{reservedToken?.position}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-background border-2 border-medical-green/30 p-6 shadow-md">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-green/20">
                            <Clock className="h-6 w-6 text-medical-green" />
                          </div>
                          <p className="text-sm text-muted-foreground">Estimated Wait</p>
                          <p className="text-4xl font-bold text-medical-green">~{reservedToken?.estimatedWait}<span className="text-2xl">min</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="rounded-lg border border-medical-green/30 bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-green/10">
                        <Stethoscope className="h-6 w-6 text-medical-green" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Consultation With</p>
                        <p className="text-lg font-bold">{reservedToken?.doctor}</p>
                        <p className="text-xs text-muted-foreground">General Physician</p>
                      </div>
                      <Badge className="bg-medical-green">
                        <span className="flex h-2 w-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
                        Confirmed
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border border-medical-green/30 bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-green/10">
                        <User className="h-6 w-6 text-medical-green" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Patient</p>
                        <p className="text-lg font-bold">{reservedToken?.patientName}</p>
                        <p className="text-xs text-muted-foreground">Phone: {patientData.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-medical-green/30 bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-green/10">
                        <Calendar className="h-6 w-6 text-medical-green" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="text-lg font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-medical-green/30 bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-green/10">
                        <Users className="h-6 w-6 text-medical-green" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Queue Status</p>
                        <p className="text-lg font-bold">{currentQueueLength - 1} patients ahead of you</p>
                        <p className="text-xs text-muted-foreground">Updated in real-time</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4">
                  <Button onClick={() => {
                    setShowBookingConfirmation(false);
                    setReservedToken(null);
                    // Remove the patient from queue
                    setQueuePatients(queuePatients.filter(p => p.id !== String(queuePatients.length)));
                  }} variant="outline" className="w-full" size="lg">
                    Cancel Booking
                  </Button>
                </div>

                {/* Important Notice */}
                <Card className="border-medical-orange/30 bg-medical-orange/5">
                  <CardContent className="flex items-start gap-3 p-4">
                    <AlertCircle className="h-5 w-5 text-medical-orange mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-medical-orange mb-1">Important Reminders</p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Arrive 10 minutes before your estimated time</li>
                        <li>Bring your Patient ID and medical documents</li>
                        <li>Your position is highlighted in the queue above</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
              )}
            </div>

            {/* Queue Info Sidebar - Only show before booking */}
            {!showBookingConfirmation && (
              <div className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Queue Summary</CardTitle>
                  <Badge variant="outline" className="animate-pulse">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">You'll Be Number</p>
                    <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 border border-primary/30 px-6 py-3">
                      <p className="text-4xl font-bold font-mono text-primary">#{currentQueueLength + 1}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Patients Ahead</span>
                      <span className="font-bold text-lg">{currentQueueLength}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Wait</span>
                      <span className="font-bold text-lg text-primary">
                        ~{(currentQueueLength + 1) * avgWaitTime} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Per Patient</span>
                      <span className="font-bold text-lg">{avgWaitTime} min</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 text-left">
                      <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Arrive <span className="font-semibold text-foreground">10 minutes early</span> and bring your Patient ID
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
