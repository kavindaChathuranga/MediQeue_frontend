import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Prescription } from '@/types';
import { mockDrugs } from '@/data/mockData';
import { Plus, Trash2, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrescriptionBuilderProps {
  prescriptions: Prescription[];
  onChange: (prescriptions: Prescription[]) => void;
  className?: string;
}

const frequencyOptions = [
  { value: 'once-daily', label: 'Once daily' },
  { value: 'twice-daily', label: 'Twice daily' },
  { value: 'three-times-daily', label: '3 times daily' },
  { value: 'four-times-daily', label: '4 times daily' },
  { value: 'every-6-hours', label: 'Every 6 hours' },
  { value: 'every-8-hours', label: 'Every 8 hours' },
  { value: 'as-needed', label: 'As needed (PRN)' },
];

const durationOptions = [
  { value: '3-days', label: '3 days' },
  { value: '5-days', label: '5 days' },
  { value: '7-days', label: '7 days' },
  { value: '10-days', label: '10 days' },
  { value: '14-days', label: '14 days' },
  { value: '30-days', label: '30 days' },
  { value: 'ongoing', label: 'Ongoing' },
];

export function PrescriptionBuilder({
  prescriptions,
  onChange,
  className,
}: PrescriptionBuilderProps) {
  const addPrescription = () => {
    const newPrescription: Prescription = {
      id: `rx-${Date.now()}`,
      drugId: '',
      drugName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    };
    onChange([...prescriptions, newPrescription]);
  };

  const updatePrescription = (index: number, updates: Partial<Prescription>) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removePrescription = (index: number) => {
    onChange(prescriptions.filter((_, i) => i !== index));
  };

  const handleDrugSelect = (index: number, drugId: string) => {
    const drug = mockDrugs.find((d) => d.id === drugId);
    if (drug) {
      updatePrescription(index, {
        drugId: drug.id,
        drugName: drug.name,
      });
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          Prescription
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addPrescription}>
          <Plus className="h-4 w-4 mr-2" />
          Add Drug
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Pill className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No medications added yet</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={addPrescription}
          >
            Add first medication
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx, index) => (
            <div
              key={rx.id}
              className="rounded-lg border bg-card p-4 space-y-4"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Drug #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removePrescription(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Drug Name</label>
                  <Select
                    value={rx.drugId}
                    onValueChange={(value) => handleDrugSelect(index, value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Search and select drug..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {mockDrugs.map((drug) => (
                        <SelectItem key={drug.id} value={drug.id}>
                          {drug.name} ({drug.genericName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Dosage</label>
                  <Input
                    className="mt-1.5"
                    placeholder="e.g., 500mg"
                    value={rx.dosage}
                    onChange={(e) =>
                      updatePrescription(index, { dosage: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Frequency</label>
                  <Select
                    value={rx.frequency}
                    onValueChange={(value) =>
                      updatePrescription(index, { frequency: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {frequencyOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Select
                    value={rx.duration}
                    onValueChange={(value) =>
                      updatePrescription(index, { duration: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {durationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Special Instructions</label>
                  <Input
                    className="mt-1.5"
                    placeholder="e.g., Take after meals"
                    value={rx.instructions}
                    onChange={(e) =>
                      updatePrescription(index, { instructions: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
