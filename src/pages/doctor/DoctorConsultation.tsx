import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Pill,
  Calendar,
  Plus,
  Trash2,
  Send,
  User,
  FileText,
  Clock,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock Data
const mockInventory = [
  { name: 'Paracetamol 500mg', stock: 120, available: true },
  { name: 'Amoxicillin 250mg', stock: 0, available: false },
  { name: 'Ibuprofen 400mg', stock: 85, available: true },
  { name: 'Metformin 500mg', stock: 45, available: true },
  { name: 'Atorvastatin 10mg', stock: 0, available: false },
  { name: 'Omeprazole 20mg', stock: 60, available: true },
  { name: 'Aspirin 75mg', stock: 95, available: true },
  { name: 'Ciprofloxacin 500mg', stock: 0, available: false },
];

const mockPatientHistory = [
  { date: '2025-12-01', diagnosis: 'Viral Fever', drugs: ['Paracetamol 500mg', 'Vitamin C'] },
  { date: '2025-11-15', diagnosis: 'Common Cold', drugs: ['Ibuprofen 400mg', 'Antihistamine'] },
  { date: '2025-10-20', diagnosis: 'Gastritis', drugs: ['Omeprazole 20mg', 'Antacid'] },
];

const currentPatient = {
  name: 'John Smith',
  id: 'P12345',
  age: 45,
  gender: 'Male',
  tokenNumber: 'A003',
  allergies: ['Penicillin', 'Sulfa drugs'],
  chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
};

interface Medication {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: {
    morning: boolean;
    noon: boolean;
    evening: boolean;
    night: boolean;
  };
  mealInstruction: 'before' | 'after' | 'with' | '';
}

export default function DoctorConsultation() {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);

  // Check if drug is in stock
  const checkStock = (drugName: string) => {
    if (!drugName.trim()) return null;
    const drug = mockInventory.find(
      (item) => item.name.toLowerCase() === drugName.toLowerCase()
    );
    return drug || null;
  };

  // Add new medication row
  const addMedication = () => {
    const newMed: Medication = {
      id: Date.now().toString(),
      drugName: '',
      dosage: '',
      frequency: '',
      duration: '',
      timing: {
        morning: false,
        noon: false,
        evening: false,
        night: false,
      },
      mealInstruction: '',
    };
    setMedications([...medications, newMed]);
  };

  // Remove medication
  const removeMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  // Update medication field
  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  // Update timing checkbox
  const updateTiming = (id: string, timeOfDay: keyof Medication['timing'], checked: boolean) => {
    setMedications(
      medications.map((med) =>
        med.id === id
          ? { ...med, timing: { ...med.timing, [timeOfDay]: checked } }
          : med
      )
    );
  };

  // Handle submission
  const handleSendToReception = () => {
    if (medications.length === 0) {
      toast({
        title: 'No Medications',
        description: 'Please add at least one medication to the prescription.',
        variant: 'destructive',
      });
      return;
    }

    // Validate all medications have required fields
    const incomplete = medications.some(
      (med) => !med.drugName || !med.dosage || !med.duration
    );

    if (incomplete) {
      toast({
        title: 'Incomplete Prescription',
        description: 'Please fill in all medication details.',
        variant: 'destructive',
      });
      return;
    }

    // Success - send to reception
    toast({
      title: 'Sent to Reception',
      description: 'Prescription has been sent to reception for billing and dispensing.',
    });

    // Clear form
    setSymptoms('');
    setDiagnosis('');
    setNotes('');
    setMedications([]);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Consultation & Prescription</h1>
        <p className="text-muted-foreground">Create consultation notes and prescriptions</p>
      </div>

      {/* Split Screen Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT SIDE - Patient History (1/3 width) */}
        <div className="md:col-span-1 space-y-4">
          {/* Patient Header Card */}
          <Card>
            <CardContent className="p-4">
              {/* ALLERGY WARNING - Top Priority */}
              {currentPatient.allergies.length > 0 && (
                <Alert variant="destructive" className="mb-4 border-2 border-red-600 bg-red-50">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-bold text-red-800">
                    ALLERGIES: {currentPatient.allergies.join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              {/* Patient Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{currentPatient.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    ID: {currentPatient.id}
                  </p>
                </div>
                <Badge className="bg-blue-600">Token: {currentPatient.tokenNumber}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Age:</span>
                  <span className="ml-2 font-medium">{currentPatient.age}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="ml-2 font-medium">{currentPatient.gender}</span>
                </div>
              </div>

              {/* Chronic Conditions Warning */}
              {currentPatient.chronicConditions.length > 0 && (
                <Alert className="border-yellow-600 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                  <AlertDescription className="text-yellow-800 font-semibold">
                    Chronic: {currentPatient.chronicConditions.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Timeline - Past Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative">
                {/* Timeline Line */}
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border"></div>

                {mockPatientHistory.map((visit, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></div>

                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {visit.date}
                        </span>
                      </div>
                      <p className="font-semibold text-sm">{visit.diagnosis}</p>
                      <div className="flex flex-wrap gap-1">
                        {visit.drugs.map((drug, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Pill className="h-3 w-3 mr-1" />
                            {drug}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE - Current Consultation (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          {/* Consultation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Current Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe patient's symptoms..."
                  className="min-h-[120px]"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Enter diagnosis..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Clinical Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes, recommendations, follow-up instructions..."
                  className="min-h-[80px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Smart Prescription Writer */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-teal-600" />
                  Prescription
                </CardTitle>
                <Button onClick={addMedication} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p>No medications added yet. Click "Add Medication" to start.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Medication Cards */}
                  {medications.map((med) => {
                    const stockInfo = checkStock(med.drugName);
                    return (
                      <div
                        key={med.id}
                        className="border-2 rounded-lg p-4 bg-gradient-to-br from-white to-blue-50/30 space-y-4"
                      >
                        {/* Row 1: Basic Info */}
                        <div className="grid grid-cols-12 gap-3 items-start">
                          <div className="col-span-4">
                            <Label className="text-xs text-muted-foreground mb-1">Drug Name</Label>
                            <Input
                              placeholder="Drug name..."
                              value={med.drugName}
                              onChange={(e) =>
                                updateMedication(med.id, 'drugName', e.target.value)
                              }
                              className="text-sm font-medium"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground mb-1">Dosage</Label>
                            <Input
                              placeholder="500mg"
                              value={med.dosage}
                              onChange={(e) =>
                                updateMedication(med.id, 'dosage', e.target.value)
                              }
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground mb-1">Duration</Label>
                            <Input
                              placeholder="7 days"
                              value={med.duration}
                              onChange={(e) =>
                                updateMedication(med.id, 'duration', e.target.value)
                              }
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-xs text-muted-foreground mb-1">Stock Status</Label>
                            {stockInfo ? (
                              stockInfo.available ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs font-medium py-2">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>In Stock ({stockInfo.stock})</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600 text-xs font-medium py-2">
                                  <XCircle className="h-4 w-4" />
                                  <span>Out of Stock</span>
                                </div>
                              )
                            ) : med.drugName.trim() ? (
                              <span className="text-xs text-muted-foreground py-2 block">Not found</span>
                            ) : (
                              <span className="text-xs text-muted-foreground py-2 block">-</span>
                            )}
                          </div>
                          <div className="col-span-1 flex justify-end pt-5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMedication(med.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Row 2: Timing & Meal Instructions */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          {/* Timing Checkboxes */}
                          <div>
                            <Label className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              TIMING
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2 bg-white rounded p-2 border">
                                <Checkbox
                                  id={`${med.id}-morning`}
                                  checked={med.timing.morning}
                                  onCheckedChange={(checked) =>
                                    updateTiming(med.id, 'morning', checked as boolean)
                                  }
                                />
                                <label
                                  htmlFor={`${med.id}-morning`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                                >
                                  <Sunrise className="h-3 w-3 text-orange-500" />
                                  Morning
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 bg-white rounded p-2 border">
                                <Checkbox
                                  id={`${med.id}-noon`}
                                  checked={med.timing.noon}
                                  onCheckedChange={(checked) =>
                                    updateTiming(med.id, 'noon', checked as boolean)
                                  }
                                />
                                <label
                                  htmlFor={`${med.id}-noon`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                                >
                                  <Sun className="h-3 w-3 text-yellow-500" />
                                  Noon
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 bg-white rounded p-2 border">
                                <Checkbox
                                  id={`${med.id}-evening`}
                                  checked={med.timing.evening}
                                  onCheckedChange={(checked) =>
                                    updateTiming(med.id, 'evening', checked as boolean)
                                  }
                                />
                                <label
                                  htmlFor={`${med.id}-evening`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                                >
                                  <Sunset className="h-3 w-3 text-orange-600" />
                                  Evening
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 bg-white rounded p-2 border">
                                <Checkbox
                                  id={`${med.id}-night`}
                                  checked={med.timing.night}
                                  onCheckedChange={(checked) =>
                                    updateTiming(med.id, 'night', checked as boolean)
                                  }
                                />
                                <label
                                  htmlFor={`${med.id}-night`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                                >
                                  <Moon className="h-3 w-3 text-blue-600" />
                                  Night
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Meal Instructions Radio */}
                          <div>
                            <Label className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                              <Pill className="h-3 w-3" />
                              MEAL INSTRUCTION
                            </Label>
                            <div className="space-y-2">
                              <div
                                className={`flex items-center space-x-2 bg-white rounded p-2 border cursor-pointer ${
                                  med.mealInstruction === 'before' ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                                onClick={() => updateMedication(med.id, 'mealInstruction', 'before')}
                              >
                                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  med.mealInstruction === 'before' ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                  {med.mealInstruction === 'before' && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                  )}
                                </div>
                                <label className="text-sm font-medium cursor-pointer">
                                  Before Meals
                                </label>
                              </div>
                              <div
                                className={`flex items-center space-x-2 bg-white rounded p-2 border cursor-pointer ${
                                  med.mealInstruction === 'after' ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                                onClick={() => updateMedication(med.id, 'mealInstruction', 'after')}
                              >
                                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  med.mealInstruction === 'after' ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                  {med.mealInstruction === 'after' && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                  )}
                                </div>
                                <label className="text-sm font-medium cursor-pointer">
                                  After Meals
                                </label>
                              </div>
                              <div
                                className={`flex items-center space-x-2 bg-white rounded p-2 border cursor-pointer ${
                                  med.mealInstruction === 'with' ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                                onClick={() => updateMedication(med.id, 'mealInstruction', 'with')}
                              >
                                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  med.mealInstruction === 'with' ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                  {med.mealInstruction === 'with' && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                  )}
                                </div>
                                <label className="text-sm font-medium cursor-pointer">
                                  With Meals
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Action */}
          <div className="flex justify-end">
            <Button
              onClick={handleSendToReception}
              size="lg"
              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8"
            >
              <Send className="h-5 w-5 mr-2" />
              Send to Reception
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
