import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  IdCard,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export default function PatientProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock patient data - in real app, this would come from API
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Smith',
    patientId: user?.id || 'P001',
    email: user?.email || 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '123 Medical Street, Healthcare City, HC 12345',
    emergencyContact: 'Jane Smith - +1 (555) 987-6543',
    registeredDate: '2024-01-15',
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    // TODO: Save to API
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-medical-green hover:bg-medical-green/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Overview Card */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-muted-foreground">Patient ID: {profileData.patientId}</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="text-sm">
                  {profileData.bloodGroup}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {calculateAge(profileData.dateOfBirth)} years old
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {profileData.gender}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{profileData.name}</p>
              )}
            </div>

            {/* Patient ID */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-muted-foreground" />
                Patient ID
              </Label>
              <p className="text-lg font-medium font-mono">{profileData.patientId}</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{profileData.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{profileData.phone}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date of Birth
              </Label>
              {isEditing ? (
                <Input
                  id="dob"
                  type="date"
                  value={editData.dateOfBirth}
                  onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">
                  {new Date(profileData.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Gender
              </Label>
              <p className="text-lg font-medium">{profileData.gender}</p>
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-muted-foreground" />
                Blood Group
              </Label>
              <p className="text-lg font-medium">{profileData.bloodGroup}</p>
            </div>

            {/* Registered Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Registered Date
              </Label>
              <p className="text-lg font-medium">
                {new Date(profileData.registeredDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Address</CardTitle>
          <CardDescription>Your contact details and location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Address
            </Label>
            {isEditing ? (
              <Input
                id="address"
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              />
            ) : (
              <p className="text-lg font-medium">{profileData.address}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="emergency" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Emergency Contact
            </Label>
            {isEditing ? (
              <Input
                id="emergency"
                value={editData.emergencyContact}
                onChange={(e) => setEditData({ ...editData, emergencyContact: e.target.value })}
              />
            ) : (
              <p className="text-lg font-medium">{profileData.emergencyContact}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
