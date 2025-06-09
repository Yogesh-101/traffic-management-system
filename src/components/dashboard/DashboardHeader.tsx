import React, { useState } from 'react';
import { Settings, User, LogOut, Shield, Users, Key, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import NotificationsDropdown from './NotificationsDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-traffic-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-traffic-accent flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-white animate-pulse-slow"></div>
          </div>
          <h1 className="text-xl font-bold">SmartFlow Traffic Management System</h1>
          <Badge variant="outline" className="ml-2 bg-traffic-secondary text-white border-none">
            v1.0
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <NotificationsDropdown />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-traffic-secondary"
            onClick={() => navigate('/settings')}
          >
            <Settings size={20} />
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm hidden md:inline">{user?.email || 'Admin'}</span>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-traffic-secondary text-white hover:bg-traffic-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-traffic-primary/20 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{user?.email || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="text-red-500 focus:text-red-500 focus:bg-red-50"
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
