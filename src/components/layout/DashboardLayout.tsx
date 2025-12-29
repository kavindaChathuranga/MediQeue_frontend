import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X } from 'lucide-react';
import DoctorProfileSettings from '../../pages/doctor/DoctorProfileSettings';
import DoctorClinicIdentity from '../../pages/doctor/DoctorClinicIdentity';

type QuickPanel = 'profile' | 'identity';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openPanels, setOpenPanels] = useState<QuickPanel[]>([]);
  const [activePanel, setActivePanel] = useState<QuickPanel | null>(null);

  const openPanel = (panel: QuickPanel) => {
    setOpenPanels((prev) => (prev.includes(panel) ? prev : [...prev, panel]));
    setActivePanel(panel);
  };

  const closePanel = (panel: QuickPanel) => {
    setOpenPanels((prev) => {
      const next = prev.filter((p) => p !== panel);
      setActivePanel((current) => {
        if (current !== panel) return current;
        return next[next.length - 1] ?? null;
      });
      return next;
    });
  };

  const renderPanel = (panel: QuickPanel) => {
    if (panel === 'identity') {
      return <DoctorClinicIdentity key={panel} embedded onClose={() => closePanel(panel)} />;
    }

    return <DoctorProfileSettings key={panel} embedded />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onOpenPanel={(panel) => {
          openPanel(panel);
          setSidebarOpen(false);
        }}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        disabled={openPanels.length > 0}
      />
      <main className="md:pl-64">
        <div className="container py-6 space-y-6">
          {openPanels.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {openPanels.map((panel) => (
                  <Button
                    key={panel}
                    variant={panel === activePanel ? 'default' : 'secondary'}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setActivePanel(panel)}
                  >
                    {panel === 'profile' ? 'Profile Settings' : 'Clinic Identity'}
                    <span
                      className="ml-1 flex h-4 w-4 items-center justify-center rounded hover:bg-black/10"
                      role="button"
                      aria-label={`Close ${panel === 'profile' ? 'Profile Settings' : 'Clinic Identity'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        closePanel(panel);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Button>
                ))}
              </div>
              {activePanel && (
                <div className="space-y-4">
                  {renderPanel(activePanel)}
                </div>
              )}
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}
