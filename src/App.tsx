import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "@/contexts/AuthContext";

// Components
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";

// Patient Pages (Public)
import PatientLanding from "@/pages/patient/PatientLanding";
import PatientReserve from "@/pages/patient/PatientReserve";

// Reception Pages
import ReceptionDashboard from "@/pages/reception/ReceptionDashboard";
import ReceptionRegister from "@/pages/reception/ReceptionRegister";
import ReceptionQueue from "@/pages/reception/ReceptionQueue";
import ReceptionDispense from "@/pages/reception/ReceptionDispense";
import ReceptionBilling from "@/pages/reception/ReceptionBilling";

// Doctor Pages
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorQueue from "@/pages/doctor/DoctorQueue";
import DoctorConsultation from "@/pages/doctor/DoctorConsultation";
import DoctorAnalytics from "@/pages/doctor/DoctorAnalytics";
import DoctorProfileSettings from "@/pages/doctor/DoctorProfileSettings";

// Other Pages
import InventoryPage from "@/pages/inventory/InventoryPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import QueueDisplay from "@/pages/display/QueueDisplay";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PatientLanding />} />
            <Route path="/reserve" element={<PatientReserve />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Queue Display (TV Mode - Public) */}
            <Route path="/display" element={<QueueDisplay />} />

            {/* Protected Doctor Routes */}
            <Route element={<DashboardLayout />}>
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/queue"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorQueue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/consultation"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorConsultation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/analytics"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/profile"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorProfileSettings />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Receptionist Routes */}
            <Route element={<DashboardLayout />}>
              <Route
                path="/reception"
                element={
                  <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                    <ReceptionDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reception/register"
                element={
                  <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                    <ReceptionRegister />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reception/queue"
                element={
                  <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                    <ReceptionQueue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reception/dispense"
                element={
                  <ProtectedRoute allowedRoles={['receptionist', 'pharmacist', 'admin']}>
                    <ReceptionDispense />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reception/billing"
                element={
                  <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                    <ReceptionBilling />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Inventory & Reports Routes */}
            <Route element={<DashboardLayout />}>
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute allowedRoles={['receptionist', 'pharmacist', 'manager', 'admin']}>
                    <InventoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={['receptionist', 'manager', 'admin']}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<DashboardLayout />}>
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
