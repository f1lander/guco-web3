'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import { CustomConnectButton } from './CustomConnectButton';
import { AuthModal } from './AuthModal';
import { useGameService } from '@/hooks/useGameService';
import { GamePlayer } from '@/lib/services/types';
import { User, LogOut, Wallet } from 'lucide-react';
import { useTranslation } from "@/providers/language-provider";
import { buildDataUrl } from "@/lib/utils";
import Image from "next/image";
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
  const { t } = useTranslation();

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

  // REST mode - show login/user info with CustomConnectButton styling
  if (currentUser) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              color="purple"
              className="flex items-center gap-2"
            >
              <Image
                src={buildDataUrl(currentUser.id)}
                alt="Profile"
                width={24}
                height={24}
                className="rounded-full"
              />
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
      </div>
    );
  }

  return (
    <>
      <Button
        color="yellow"
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        {t("nav.login")}
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};