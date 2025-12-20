import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDrugs, mockPatients, mockConsultations } from '@/data/mockData';
import { Search, Pill, CheckCircle, Printer, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DispenseItem {
  drugId: string;
  drugName: string;
  batchId: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function ReceptionDispense() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [dispenseItems, setDispenseItems] = useState<DispenseItem[]>([]);

  // Mock prescription for demo
  const mockPrescription = mockConsultations[0]?.prescriptions || [];

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
    // Auto-populate from prescription
    if (mockPrescription.length > 0) {
      const items: DispenseItem[] = mockPrescription.map((rx) => {
        const drug = mockDrugs.find((d) => d.id === rx.drugId);
        const batch = drug?.batches[0];
        return {
          drugId: rx.drugId,
          drugName: rx.drugName,
          batchId: batch?.id || '',
          batchNumber: batch?.batchNumber || '',
          quantity: 15,
          unitPrice: batch?.sellingPrice || 0,
          total: 15 * (batch?.sellingPrice || 0),
        };
      });
      setDispenseItems(items);
    }
  };

  const updateQuantity = (index: number, quantity: number) => {
    setDispenseItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity, total: quantity * item.unitPrice }
          : item
      )
    );
  };

  const subtotal = dispenseItems.reduce((sum, item) => sum + item.total, 0);

  const handleDispense = () => {
    toast({
      title: 'Drugs Dispensed',
      description: 'Invoice generated and sent to billing',
    });
  };

  const handlePrint = () => {
    toast({
      title: 'Printing Invoice',
      description: 'Sending to thermal printer...',
    });
  };

  const patient = mockPatients.find((p) => p.id === selectedPatient);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Prescription Dispensing</h1>
        <p className="text-muted-foreground">
          Search patient, view prescription, and dispense medications
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search & Patient Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Find Patient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or Token..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {mockPatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePatientSelect(p.id)}
                    className={cn(
                      'w-full rounded-lg border p-3 text-left transition-all hover:border-primary/50',
                      selectedPatient === p.id && 'border-primary bg-primary/5'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.name}</span>
                      <Badge variant="outline">{p.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{p.phone}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {patient && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-mono">{patient.id}</p>
                </div>
                {patient.allergies.length > 0 && (
                  <div className="rounded-lg bg-destructive/10 p-3">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Allergies</span>
                    </div>
                    <p className="text-sm mt-1">{patient.allergies.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Prescription & Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Prescription Items
              </CardTitle>
              <CardDescription>
                Select batch and adjust quantities before dispensing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dispenseItems.length > 0 ? (
                <div className="space-y-4">
                  {dispenseItems.map((item, index) => {
                    const drug = mockDrugs.find((d) => d.id === item.drugId);
                    return (
                      <div
                        key={index}
                        className="rounded-lg border p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{item.drugName}</p>
                            <p className="text-sm text-muted-foreground">
                              {drug?.genericName}
                            </p>
                          </div>
                          <Badge variant="outline">{drug?.category}</Badge>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <label className="text-sm text-muted-foreground">
                              Batch (FEFO)
                            </label>
                            <Select defaultValue={item.batchId}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card">
                                {drug?.batches.map((batch) => (
                                  <SelectItem key={batch.id} value={batch.id}>
                                    {batch.batchNumber} (Exp:{' '}
                                    {new Date(batch.expiryDate).toLocaleDateString()})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-muted-foreground">
                              Quantity
                            </label>
                            <Input
                              type="number"
                              min={1}
                              className="mt-1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(index, parseInt(e.target.value) || 0)
                              }
                            />
                          </div>

                          <div>
                            <label className="text-sm text-muted-foreground">
                              Subtotal
                            </label>
                            <p className="mt-2.5 font-medium">
                              ${item.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Pill className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="font-medium">No prescription loaded</p>
                  <p className="text-sm text-muted-foreground">
                    Select a patient to view their prescription
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          {dispenseItems.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${(subtotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${(subtotal * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleDispense}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Dispense & Bill
                  </Button>
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
