import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Stethoscope, ClipboardList, User, ArrowLeft, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'doctor', label: 'Doctor', icon: Stethoscope, description: 'Access consultations & patient care' },
  { value: 'receptionist', label: 'Receptionist', icon: ClipboardList, description: 'Manage queue, billing & inventory' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!selectedRole) {
      toast({ title: 'Select Role', description: 'Please select your role to continue', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const success = await login(email, password, selectedRole);
    setIsLoading(false);

    if (success) {
      toast({ title: 'Login Successful', description: `Welcome back!` });
      // Redirect based on role
      const redirects: Record<UserRole, string> = {
        doctor: '/doctor',
        receptionist: '/reception',
        pharmacist: '/inventory',
        manager: '/reports',
        admin: '/admin/settings',
      };
      navigate(redirects[selectedRole]);
    } else {
      toast({ title: 'Login Failed', description: 'Invalid credentials', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Stethoscope className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Staff Login</CardTitle>
            <CardDescription>Select your role and sign in to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Role</label>
              <div className="grid gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={cn(
                      'flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all',
                      selectedRole === role.value
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-lg',
                        selectedRole === role.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      )}
                    >
                      <role.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{role.label}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleLogin} disabled={isLoading}>
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Demo Hint */}
            <div className="rounded-lg bg-secondary/50 p-3 text-center text-sm text-muted-foreground">
              <p className="font-medium">Demo Mode</p>
              <p>Select any role and click Sign In</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
