"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameService } from "@/hooks/useGameService";
import { UnifiedConnectButton } from "@/components/molecules/UnifiedConnectButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { GamePlayer } from "@/lib/services/types";

export function WalletHeader() {
  const [currentUser, setCurrentUser] = useState<GamePlayer | null>(null);
  const { getCurrentUser, logout, isWeb3Mode } = useGameService();

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, [getCurrentUser]);

  const handleLogout = async () => {
    if (!isWeb3Mode) {
      await logout();
      setCurrentUser(null);
    }
  };

  const getUserDisplay = () => {
    if (!currentUser) return "Guest";
    
    if (isWeb3Mode) {
      // Web3 mode: show wallet address
      return `${currentUser.id.slice(0, 6)}...${currentUser.id.slice(-4)}`;
    } else {
      // REST mode: show username
      return currentUser.username || "User";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-end">
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                {getUserDisplay()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isWeb3Mode && (
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              )}
              {isWeb3Mode && (
                <DropdownMenuItem disabled>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect (use wallet)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <UnifiedConnectButton />
        )}
      </div>
    </header>
  );
}
