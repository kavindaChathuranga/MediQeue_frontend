import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ListOrdered,
  Stethoscope,
  Pill,
  Receipt,
  Settings,
  Monitor,
  UserPlus,
  ClipboardList,
  Package,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Doctor Items
  { label: 'Dashboard', icon: LayoutDashboard, href: '/doctor', roles: ['doctor', 'admin'] },
  { label: 'Queue Viewer', icon: ListOrdered, href: '/doctor/queue', roles: ['doctor', 'admin'] },
  { label: 'New Consultation', icon: ClipboardList, href: '/doctor/consultation', roles: ['doctor', 'admin'] },
  { label: 'Analytics', icon: BarChart3, href: '/doctor/analytics', roles: ['doctor', 'admin'] },
  
  // Receptionist Items
  { label: 'Dashboard', icon: LayoutDashboard, href: '/reception', roles: ['receptionist'] },
  { label: 'Patient Registration', icon: UserPlus, href: '/reception/register', roles: ['receptionist'] },
  { label: 'Queue Management', icon: ListOrdered, href: '/reception/queue', roles: ['receptionist'] },
  { label: 'Dispensing', icon: Pill, href: '/reception/dispense', roles: ['receptionist', 'pharmacist'] },
  { label: 'Billing / POS', icon: Receipt, href: '/reception/billing', roles: ['receptionist'] },
  { label: 'Inventory', icon: Package, href: '/inventory', roles: ['receptionist', 'pharmacist', 'manager'] },
  { label: 'Reports', icon: BarChart3, href: '/reports', roles: ['receptionist', 'manager'] },
  { label: 'Queue Display', icon: Monitor, href: '/display', roles: ['receptionist'] },
  
  // Admin Items
  { label: 'User Management', icon: Shield, href: '/admin/users', roles: ['admin'] },
  { label: 'Settings', icon: Settings, href: '/admin/settings', roles: ['admin'] },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 256px (w-64)
  const [isResizing, setIsResizing] = useState(false);
  const [previousWidth, setPreviousWidth] = useState(256); // Store width before minimizing

  const minWidth = 64; // Minimum width for icon-only mode
  const maxWidth = 400;
  const iconOnlyThreshold = 100; // Show icons only when width is below this

  // Handle resize start
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Handle double-click to toggle minimize
  const handleDoubleClick = () => {
    if (sidebarWidth > iconOnlyThreshold) {
      // Minimize to icon-only mode
      setPreviousWidth(sidebarWidth);
      setSidebarWidth(minWidth);
      
      const main = document.querySelector('main');
      if (main) {
        main.style.paddingLeft = `${minWidth}px`;
      }
    } else {
      // Restore to previous width
      const restoreWidth = previousWidth > iconOnlyThreshold ? previousWidth : 256;
      setSidebarWidth(restoreWidth);
      
      const main = document.querySelector('main');
      if (main) {
        main.style.paddingLeft = `${restoreWidth}px`;
      }
    }
  };

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
        
        // Update main content padding
        const main = document.querySelector('main');
        if (main) {
          main.style.paddingLeft = `${newWidth}px`;
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Update main content padding on mount and width change
  useEffect(() => {
    const main = document.querySelector('main');
    if (main && window.innerWidth >= 768) {
      main.style.paddingLeft = `${sidebarWidth}px`;
      main.style.transition = isResizing ? 'none' : 'padding-left 0.3s';
    }
  }, [sidebarWidth, isResizing]);

  // Sidebar is only for staff - if no user, don't render anything
  if (!user) {
    return null;
  }

  const userRole = user.role;
  
  // Filter items based on user role
  const filteredItems = navItems.filter((item) => item.roles.includes(userRole));
  
  // Determine if we should show icons only
  const showIconsOnly = sidebarWidth < iconOnlyThreshold;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-card md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          className={cn(
            'absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 transition-colors group hidden md:block',
            isResizing && 'bg-primary'
          )}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary/30 group-hover:bg-primary/70 rounded-full transition-colors" />
        </div>

        <nav className={cn(
          "flex flex-col gap-1 p-4",
          showIconsOnly && "px-2"
        )}>
          {filteredItems.map((item) => {
            // Use exact match for active state to prevent multiple tabs being active
            const isActive = location.pathname === item.href;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                title={showIconsOnly ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  showIconsOnly && 'justify-center px-2'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!showIconsOnly && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
