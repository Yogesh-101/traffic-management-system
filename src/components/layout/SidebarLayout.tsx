
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BarChart3, 
  Map, 
  AlertTriangle, 
  Settings, 
  FileText, 
  HelpCircle,
  LogOut
} from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-traffic-secondary/10",
        active ? "bg-traffic-secondary/10 text-traffic-secondary font-medium" : "text-slate-500"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const SidebarLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, user } = useAuth();

  const sidebarItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', href: '/' },
    { icon: <BarChart3 size={18} />, label: 'Analytics', href: '/analytics' },
    { icon: <Map size={18} />, label: 'Traffic Map', href: '/map' },
    { icon: <AlertTriangle size={18} />, label: 'Incidents', href: '/incidents' },
    { icon: <FileText size={18} />, label: 'Reports', href: '/reports' },
    { icon: <Settings size={18} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-4 flex items-center gap-2 border-b">
          <div className="h-8 w-8 rounded-md bg-traffic-primary flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-white animate-pulse-slow"></div>
          </div>
          <h1 className="text-lg font-bold">SmartFlow</h1>
        </div>
        
        {user && (
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-traffic-muted">Traffic Administrator</p>
          </div>
        )}
        
        <div className="flex-1 py-6 px-3 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={
                item.href === '/' 
                  ? currentPath === '/' 
                  : currentPath.startsWith(item.href)
              }
            />
          ))}
        </div>
        
        <div className="p-3 mt-auto border-t">
          <div className="flex flex-col gap-1">
            <SidebarItem 
              icon={<HelpCircle size={18} />} 
              label="Help & Support" 
              href="/help" 
              active={currentPath === '/help'}
            />
            <Button 
              className="flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-red-50 text-red-500 w-full font-normal"
              variant="ghost"
              onClick={signOut}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 container mx-auto py-6 px-4">
          <Outlet />
        </main>
        
        <footer className="bg-traffic-primary text-white py-3 px-4">
          <div className="container mx-auto text-center text-sm">
            © 2025 SmartFlow Traffic Management System — <span className="opacity-75">Version 1.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SidebarLayout;
