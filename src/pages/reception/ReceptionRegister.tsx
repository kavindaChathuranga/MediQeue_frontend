import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { PatientRegistrationForm } from '@/components/forms/PatientRegistrationForm';
import { generateTokenNumber } from '@/data/mockData';
import { CheckCircle, Printer, MessageSquare, ArrowRight } from 'lucide-react';

export default function ReceptionRegister() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    patientId: string;
    patientName: string;
    tokenNumber: string;
  } | null>(null);

  const handleSubmit = (data: any) => {
    const tokenNumber = generateTokenNumber('opd');
    setRegisteredData({
      patientId: data.id,
      patientName: data.name,
      tokenNumber,
    });
    setShowSuccess(true);
    toast({
      title: 'Patient Registered',
      description: `Token ${tokenNumber} issued for ${data.name}`,
    });
  };

  const handlePrintToken = () => {
    toast({
      title: 'Printing Token',
      description: 'Sending to thermal printer...',
    });
  };

  const handleSendSMS = () => {
    toast({
      title: 'SMS Sent',
      description: 'Token details sent to patient',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patient Registration</h1>
        <p className="text-muted-foreground">
          Register walk-in patients and issue queue tokens
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Patient Registration</CardTitle>
          <CardDescription>
            Fill in patient details. Token will be issued automatically after registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientRegistrationForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-card max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-medical-green/20">
              <CheckCircle className="h-8 w-8 text-medical-green" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Registration Complete!
            </DialogTitle>
            <DialogDescription className="text-center">
              Patient has been registered and token issued
            </DialogDescription>
          </DialogHeader>

          {registeredData && (
            <div className="space-y-4 pt-4">
              <div className="rounded-xl border-2 bg-primary/5 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Token Number</p>
                <p className="text-4xl font-bold font-mono text-primary">
                  {registeredData.tokenNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-muted-foreground">Patient ID</p>
                  <p className="font-medium font-mono">{registeredData.patientId}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{registeredData.patientName}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handlePrintToken}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Token
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleSendSMS}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              </div>

              <Button className="w-full" onClick={() => setShowSuccess(false)}>
                Register Another Patient
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
