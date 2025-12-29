import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ClinicIdentity {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicLogo: string;
}

const IDENTITY_STORAGE_KEY = 'clinicIdentitySettings';

export default function DoctorClinicIdentity({ embedded = false, onClose }: { embedded?: boolean; onClose?: () => void }) {
  const [identity, setIdentity] = useState<ClinicIdentity>({
    clinicName: 'MediQueue Clinic',
    clinicAddress: '123 Main St, Colombo',
    clinicPhone: '+94 77 123 4567',
    clinicLogo: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem(IDENTITY_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ClinicIdentity;
        setIdentity(parsed);
      } catch (err) {
        console.error('Failed to parse clinic identity settings', err);
      }
    }
  }, []);

  const handleChange = (field: keyof ClinicIdentity, value: string) => {
    setIdentity((prev) => ({ ...prev, [field]: value }));
  };

  const handleFile = (field: 'clinicLogo', file: File) => {
    const url = URL.createObjectURL(file);
    setIdentity((prev) => ({ ...prev, [field]: url }));
  };

  const handleSave = () => {
    localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(identity));
    toast({ title: 'Saved', description: 'Clinic identity will be used for certificates and prescriptions.' });
    onClose?.();
  };

  return (
    <div className={embedded ? 'space-y-6' : 'space-y-6 p-6'}>
      {!embedded && (
        <div>
          <h1 className="text-3xl font-bold">Clinic Identity</h1>
          <p className="text-muted-foreground">Branding used across certificates and prescriptions.</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Clinic Identity & Certificate Branding</CardTitle>
          <CardDescription>Keep these details current to ensure correct branding.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Clinic Name</Label>
            <Input
              value={identity.clinicName}
              onChange={(e) => handleChange('clinicName', e.target.value)}
              placeholder="Clinic name"
            />
          </div>
          <div className="space-y-2">
            <Label>Clinic Phone</Label>
            <Input
              value={identity.clinicPhone}
              onChange={(e) => handleChange('clinicPhone', e.target.value)}
              placeholder="Phone"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Clinic Address</Label>
            <Textarea
              value={identity.clinicAddress}
              onChange={(e) => handleChange('clinicAddress', e.target.value)}
              placeholder="Address"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Clinic Logo</Label>
            <Input
              type="file"
              accept="image/*"
              className="cursor-pointer"
              onChange={(e) => e.target.files?.[0] && handleFile('clinicLogo', e.target.files[0])}
            />
            {identity.clinicLogo && (
              <div className="flex items-center gap-3">
                <img src={identity.clinicLogo} alt="Clinic logo" className="h-14 object-contain rounded" />
                <Button variant="ghost" size="sm" onClick={() => handleChange('clinicLogo', '')}>
                  Remove
                </Button>
              </div>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleSave}>Save Identity</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
