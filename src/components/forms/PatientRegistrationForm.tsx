import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generatePatientId } from '@/data/mockData';
import { RefreshCw } from 'lucide-react';

const patientSchema = z.object({
  id: z.string().min(1, 'Patient ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientRegistrationFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function PatientRegistrationForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: PatientRegistrationFormProps) {
  const [autoGenerateId, setAutoGenerateId] = useState(true);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      id: generatePatientId(),
      name: '',
      phone: '',
      dob: '',
      gender: 'male',
      address: '',
      allergies: '',
      chronicConditions: '',
    },
  });

  const handleSubmit = (data: PatientFormData) => {
    onSubmit(data);
  };

  const regenerateId = () => {
    form.setValue('id', generatePatientId());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoGenerateId}
              onCheckedChange={setAutoGenerateId}
            />
            <span className="text-sm text-muted-foreground">Auto-generate ID</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient ID</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      {...field}
                      disabled={autoGenerateId}
                      className="font-mono"
                    />
                    {autoGenerateId && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={regenerateId}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 8900" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter full address..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Known Allergies</FormLabel>
                <FormControl>
                  <Input placeholder="Penicillin, Aspirin..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chronicConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chronic Conditions</FormLabel>
                <FormControl>
                  <Input placeholder="Diabetes, Hypertension..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Patient'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
