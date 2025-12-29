import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface DoctorProfile {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  slmcNumber: string;
  systemPassword: string;
  signatureImage: string;
}

const STORAGE_KEY = 'doctorProfileSettings';

export default function DoctorProfileSettings({ embedded = false }: { embedded?: boolean }) {
  const [profile, setProfile] = useState<DoctorProfile>({
    name: 'Dr. Emily Chen',
    email: 'emily.chen@example.com',
    phone: '+94 77 123 4567',
    specialization: 'General Medicine',
    slmcNumber: 'SLMC-12345',
    systemPassword: '',
    signatureImage: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DoctorProfile;
        setProfile(parsed);
      } catch (err) {
        console.error('Failed to parse saved profile settings', err);
      }
    }
  }, []);

  const handleChange = (field: keyof DoctorProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        toast({ title: 'Passwords do not match', variant: 'destructive' });
        return;
      }
      if (!password) {
        toast({ title: 'Password is required', variant: 'destructive' });
        return;
      }
    }

    const nextProfile: DoctorProfile = {
      ...profile,
      systemPassword: password || profile.systemPassword,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
    setPassword('');
    setConfirmPassword('');

    toast({
      title: 'Profile saved',
      description: 'Details updated. The system password will be required to sign certificates.',
    });
  };

  return (
    <div className={embedded ? 'space-y-6' : 'space-y-6 p-6'}>
      {!embedded && (
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your doctor profile and verification password.</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Doctor Details</CardTitle>
          <CardDescription>These details appear on prescriptions and analytics.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={profile.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Dr. Name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Contact number" />
          </div>
          <div className="space-y-2">
            <Label>Specialization</Label>
            <Input value={profile.specialization} onChange={(e) => handleChange('specialization', e.target.value)} placeholder="e.g., General Medicine" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>SLMC Registration Number</Label>
            <Input value={profile.slmcNumber} onChange={(e) => handleChange('slmcNumber', e.target.value)} placeholder="SLMC-XXXXX" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Doctor Digital Signature</Label>
            <Input
              type="file"
              accept="image/*"
              className="cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  handleChange('signatureImage', url);
                }
              }}
            />
            {profile.signatureImage && (
              <div className="flex items-center gap-3">
                <img src={profile.signatureImage} alt="Signature" className="h-14 object-contain rounded" />
                <Button variant="ghost" size="sm" onClick={() => handleChange('signatureImage', '')}>
                  Remove
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Used when signing medical certificates and prescriptions.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Password</CardTitle>
          <CardDescription>Used to verify and sign medical certificates during consultation.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
          </div>
          <div className="md:col-span-2 text-sm text-muted-foreground">
            This password is required when issuing medical certificates. Keep it private.
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
