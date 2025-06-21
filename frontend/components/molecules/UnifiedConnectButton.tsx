'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CustomConnectButton } from './CustomConnectButton';
import { AuthModal } from './AuthModal';
import { useGameService } from '@/hooks/useGameService';
import { GamePlayer } from '@/lib/services/types';
import { User, LogOut, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UnifiedConnectButton: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<GamePlayer | null>(null);
  const { isWeb3Mode, getCurrentUser, logout } = useGameService();

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, [getCurrentUser]);

  const handleAuthSuccess = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    if (!isWeb3Mode) {
      await logout();
      setCurrentUser(null);
    }
  };

  if (isWeb3Mode) {
    // Web3 mode - use the existing CustomConnectButton
    return <CustomConnectButton />;
  }

  // REST mode - show login/user info
  if (currentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {currentUser.username || 'User'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="font-medium">{currentUser.username}</span>
              <span className="text-xs text-gray-500">
                {currentUser.levelsCompleted} levels completed
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        Login / Sign Up
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};