import { Bell, Menu, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      doctor: 'Doctor',
      receptionist: 'Receptionist',
      patient: 'Patient',
      pharmacist: 'Pharmacist',
      manager: 'Manager',
      admin: 'Administrator',
    };
    return labels[role] || role;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
            <span className="text-lg font-bold text-white">M</span>
          </div>
          <span className="hidden font-semibold md:inline-block transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">MediQueue</span>
        </div>

        <div className="flex-1 px-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-blue-500" />
            <Input
              placeholder="Search patients, tokens..."
              className="peer pl-9 bg-secondary/50 border-0 hover:bg-secondary transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-blue-500/30"
          >
            <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-blue-600" />
            <Badge className="absolute right-0 top-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs border-2 border-background bg-blue-600 text-white shadow-md">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 transition-all duration-200 rounded-lg hover:shadow-sm hover:bg-transparent focus-visible:ring-2 focus-visible:ring-blue-500/30"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 shadow-md transition-transform duration-200 hover:scale-110">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium transition-colors text-foreground">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground transition-colors">{getRoleLabel(user?.role || '')}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
