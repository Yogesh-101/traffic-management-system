import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SidebarLayout from "./components/layout/SidebarLayout";
import Analytics from "./pages/Analytics";
import TrafficMapPage from "./pages/TrafficMapPage";
import Incidents from "./pages/Incidents";
import AIPredictions from "./pages/AIPredictions";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import UserManagement from "./pages/admin/UserManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import PermissionsManagement from "./pages/admin/PermissionsManagement";
import InviteUsers from "./pages/admin/InviteUsers";
import TrafficMap from './components/TrafficMap';

// Sample pages to be implemented later
import { Card } from "@/components/ui/card";

const Reports = () => (
  <Card className="p-8">
    <h2 className="text-2xl font-bold mb-4">Reports</h2>
    <p className="text-muted-foreground">This page will contain traffic reports and data exports.</p>
  </Card>
);

const Help = () => (
  <Card className="p-8">
    <h2 className="text-2xl font-bold mb-4">Help & Support</h2>
    <p className="text-muted-foreground">Documentation, FAQs, and support resources.</p>
  </Card>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, session } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, session } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!session || session.user.role !== 'Administrator') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// App router with AuthProvider
const AppRoutes = () => {
  const { session } = useAuth();
  
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
      
      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <SidebarLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Index />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/map" element={<TrafficMapPage />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/ai-predictions" element={<AIPredictions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Route>

      {/* Admin Routes */}
      <Route element={
        <AdminRoute>
          <SidebarLayout />
        </AdminRoute>
      }>
        {/* Remove admin routes */}
        {/* { path: "/admin/users", element: <UserManagement /> },
        { path: "/admin/roles", element: <RoleManagement /> },
        { path: "/admin/permissions", element: <PermissionsManagement /> },
        { path: "/admin/invite", element: <InviteUsers /> }, */}
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const routes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><SidebarLayout /></ProtectedRoute>,
    children: [
      { path: "", element: <Index /> },
      { path: "analytics", element: <Analytics /> },
      { path: "map", element: <TrafficMapPage /> },
      { path: "incidents", element: <Incidents /> },
      { path: "ai-predictions", element: <AIPredictions /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
      { path: "help", element: <Help /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><SidebarLayout /></AdminRoute>,
    children: [
      { path: "users", element: <UserManagement /> },
      { path: "roles", element: <RoleManagement /> },
      { path: "permissions", element: <PermissionsManagement /> },
      { path: "invite", element: <InviteUsers /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <TrafficMap />
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationsProvider>
    </QueryClientProvider>
  );
};

export default App;
