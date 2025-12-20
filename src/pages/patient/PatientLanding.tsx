import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Users, Clock, ArrowRight, Armchair, User, CalendarClock } from 'lucide-react';

interface QueuePatient {
  id: string;
  tokenNumber: string;
  name: string;
  status: 'waiting' | 'now-serving' | 'completed';
  position: number;
}

export default function PatientLanding() {
  const navigate = useNavigate();
  
  // Mock queue data - in real app, this would come from API/WebSocket
  const [queuePatients] = useState<QueuePatient[]>([
    { id: '1', tokenNumber: 'A001', name: 'Sarah Johnson', status: 'now-serving', position: 1 },
    { id: '2', tokenNumber: 'A002', name: 'Michael Chen', status: 'waiting', position: 2 },
    { id: '3', tokenNumber: 'A003', name: 'Emily Davis', status: 'waiting', position: 3 },
    { id: '4', tokenNumber: 'A004', name: 'James Wilson', status: 'waiting', position: 4 },
  ]);

  const avgWaitTime = 15;
  const currentQueueLength = queuePatients.filter(p => p.status !== 'completed').length;
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary">
              <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg">MediQueue</span>
              <p className="text-xs text-muted-foreground hidden sm:block">Dispensary System</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link to="/login" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
              <span className="hidden sm:inline">Staff </span>Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-8 sm:py-12 md:py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 sm:px-4 py-1.5 text-xs sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-medical-green animate-pulse" />
            Live Queue Status
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
            Dr. Emily Chen's <span className="text-primary">Dispensary</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground px-4">
            View real-time queue status and reserve your spot online. No registration needed to view the queue.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button size="lg" onClick={() => navigate('/reserve')} className="text-base sm:text-lg w-full sm:w-auto">
              <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Reserve Your Spot
            </Button>
          </div>
        </div>
      </section>

      {/* Live Queue Visualization */}
      <section className="container pb-8 sm:pb-12 px-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/20 max-w-6xl mx-auto">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                  Current Queue Status
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Real-time patient queue - Updated live</CardDescription>
              </div>
              <Badge variant="outline" className="animate-pulse self-start sm:self-auto">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Now Serving Section */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-medical-green/20">
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-medical-green" />
                </div>
                <div>
                  <p className="font-semibold text-base sm:text-lg">Now Serving</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Currently in consultation</p>
                </div>
              </div>
              
              {queuePatients.filter(p => p.status === 'now-serving').map(patient => (
                <div
                  key={patient.id}
                  className="relative bg-gradient-to-r from-medical-green/20 to-medical-green/10 border-2 border-medical-green rounded-xl p-4 sm:p-6 animate-pulse"
                >
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-medical-green text-white shadow-lg animate-bounce text-xs sm:text-sm">
                      In Progress
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-medical-green/30 border-2 border-medical-green shadow-lg flex-shrink-0">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-medical-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xl sm:text-3xl font-bold font-mono text-medical-green">{patient.tokenNumber}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Token number being served</p>
                    </div>
                    <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-medical-green animate-pulse flex-shrink-0 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>

            {/* Waiting Queue */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Armchair className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <p className="font-semibold text-base sm:text-lg">Waiting Queue</p>
                <Badge variant="secondary" className="text-xs sm:text-sm">{queuePatients.filter(p => p.status === 'waiting').length} waiting</Badge>
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {queuePatients
                  .filter(p => p.status === 'waiting')
                  .map((patient, index) => (
                    <div
                      key={patient.id}
                      className="group relative bg-card border-2 border-border rounded-xl p-4 transition-all duration-500 hover:border-primary hover:shadow-lg"
                      style={{
                        animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <div className="absolute -top-3 -left-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-lg">
                          #{patient.position}
                        </div>
                      </div>

                      <div className="flex flex-col items-center space-y-3 pt-4">
                        <div className="relative">
                          <Armchair className="h-12 w-12 text-primary/60 group-hover:text-primary transition-colors" />
                          <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        
                        <div className="text-center space-y-1">
                          <p className="text-lg font-bold font-mono">{patient.tokenNumber}</p>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            ~{(patient.position - 1) * avgWaitTime}min wait
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

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
            `}</style>
          </CardContent>
        </Card>
      </section>

      {/* Queue Stats */}
      <section className="container pb-8 sm:pb-12 px-4">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto">
          <Card className="border-medical-blue/30 bg-medical-blue/5">
            <CardContent className="flex items-center gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-blue/20">
                <Users className="h-6 w-6 text-medical-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentQueueLength}</p>
                <p className="text-sm text-muted-foreground">In Queue</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-medical-green/30 bg-medical-green/5">
            <CardContent className="flex items-center gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-green/20">
                <Clock className="h-6 w-6 text-medical-green" />
              </div>
              <div>
                <p className="text-2xl font-bold">~{avgWaitTime}min</p>
                <p className="text-sm text-muted-foreground">Avg Wait</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-center gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">Dr. Chen</p>
                <p className="text-sm text-muted-foreground">On Duty</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-12 sm:pb-16 px-4">
        <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-background">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Reserve Your Spot?</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
              Get your token number in seconds. Fill in your details and secure your place in the queue.
            </p>
            <Button size="lg" onClick={() => navigate('/reserve')} className="text-base sm:text-lg w-full sm:w-auto">
              <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Reserve Now
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-secondary/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Dr. Emily Chen's Dispensary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
