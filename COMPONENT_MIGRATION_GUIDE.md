# Component Migration Guide

This guide shows how to update existing components to use the new unified service layer that supports both Web3 and REST API versions.

## Key Changes

### 1. Hook Replacement

**Before (Web3 only):**
```tsx
import { useGucoLevels } from '@/hooks/useGucoLevels';

const MyComponent = () => {
  const { getLevels, createGucoLevel, updatePlayer } = useGucoLevels();
  // ...
};
```

**After (Unified):**
```tsx
import { useGameService } from '@/hooks/useGameService';

const MyComponent = () => {
  const { getLevels, createLevel, completeLevel } = useGameService();
  // ...
};
```

### 2. Authentication Handling

**Before (Web3 only):**
```tsx
import { CustomConnectButton } from '@/components/molecules/CustomConnectButton';

const Header = () => {
  return (
    <header>
      <CustomConnectButton />
    </header>
  );
};
```

**After (Unified):**
```tsx
import { UnifiedConnectButton } from '@/components/molecules/UnifiedConnectButton';

const Header = () => {
  return (
    <header>
      <UnifiedConnectButton />
    </header>
  );
};
```

### 3. Level Creation Components

**Before:**
```tsx
// create-level/page.tsx
const CreateLevel = () => {
  const { createGucoLevel, isPendingCreate } = useGucoLevels();
  const { address } = useAccount();

  const handleSubmit = async () => {
    if (!address) {
      toast({ title: "Connect wallet first" });
      return;
    }
    await createGucoLevel(levelData);
  };

  return (
    <div>
      {address ? (
        <Button onClick={handleSubmit}>Create Level</Button>
      ) : (
        <CustomConnectButton />
      )}
    </div>
  );
};
```

**After:**
```tsx
// create-level/page.tsx
const CreateLevel = () => {
  const { createLevel, isLoading, getCurrentUser } = useGameService();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, [getCurrentUser]);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please login or connect wallet first" });
      return;
    }
    await createLevel(levelData);
  };

  return (
    <div>
      {user ? (
        <Button onClick={handleSubmit} disabled={isLoading}>
          Create Level
        </Button>
      ) : (
        <UnifiedConnectButton />
      )}
    </div>
  );
};
```

### 4. Level Completion Components

**Before:**
```tsx
const LevelComplete = ({ levelId, levelData }) => {
  const { updatePlayer, isPendingUpdate } = useGucoLevels();
  const { address } = useAccount();

  const handleComplete = async () => {
    if (!address) return;
    await updatePlayer(levelId, levelData);
  };

  return (
    <Dialog>
      <Button 
        onClick={handleComplete} 
        disabled={isPendingUpdate || !address}
      >
        Save Progress
      </Button>
    </Dialog>
  );
};
```

**After:**
```tsx
const LevelComplete = ({ levelId, levelData }) => {
  const { completeLevel, isLoading, getCurrentUser } = useGameService();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, [getCurrentUser]);

  const handleComplete = async () => {
    if (!user) return;
    await completeLevel(levelId, levelData);
  };

  return (
    <Dialog>
      <Button 
        onClick={handleComplete} 
        disabled={isLoading || !user}
      >
        Save Progress
      </Button>
    </Dialog>
  );
};
```

## Updated Component Examples

### Dashboard Page

```tsx
// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useGameService } from "@/hooks/useGameService";
import { LevelCard } from "@/components/molecules/LevelCard";
import { UnifiedConnectButton } from "@/components/molecules/UnifiedConnectButton";

export default function Dashboard() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getLevels, getLevelCount, isWeb3Mode } = useGameService();

  const loadLevels = async () => {
    try {
      setLoading(true);
      const count = await getLevelCount();
      const data = await getLevels(0, 20);
      setLevels(data);
    } catch (error) {
      console.error("Error loading levels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLevels();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Guco Game {isWeb3Mode ? "(Web3)" : "(REST)"}
        </h1>
        <UnifiedConnectButton />
      </div>

      {loading ? (
        <div>Loading levels...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {levels.map((level) => (
            <LevelCard key={level.id} level={level} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Create Level Page

```tsx
// app/dashboard/create-level/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useGameService } from "@/hooks/useGameService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { UnifiedConnectButton } from "@/components/molecules/UnifiedConnectButton";
import GameView from "@/components/molecules/GameView";

export default function CreateLevel() {
  const [levelData, setLevelData] = useState(null);
  const [user, setUser] = useState(null);
  const { 
    createLevel, 
    isLoading, 
    error, 
    getCurrentUser, 
    isWeb3Mode 
  } = useGameService();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, [getCurrentUser]);

  const handleSubmit = async () => {
    if (!levelData) {
      toast({
        title: "Error",
        description: "Please create a level first",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: isWeb3Mode 
          ? "Please connect your wallet" 
          : "Please login to create levels",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createLevel(levelData);
      if (result) {
        toast({
          title: "Success!",
          description: isWeb3Mode 
            ? `Level created! Transaction: ${result.txHash}` 
            : "Level created successfully!",
        });
        setLevelData(null);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to create level",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Level</h1>
        <UnifiedConnectButton />
      </div>

      <div className="space-y-6">
        <GameView
          editable={true}
          level={levelData || []}
          onLevelChange={setLevelData}
          showControls={false}
        />

        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !levelData || !user}
            className="min-w-[200px]"
          >
            {isLoading ? "Creating..." : "Create Level"}
          </Button>

          {!user && (
            <div className="text-sm text-gray-500">
              {isWeb3Mode 
                ? "Connect wallet to create levels" 
                : "Login to create levels"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Migration Checklist

### Components to Update

- [ ] `app/dashboard/page.tsx` - Replace `useGucoLevels` with `useGameService`
- [ ] `app/dashboard/create-level/page.tsx` - Update authentication flow
- [ ] `app/dashboard/level/page.tsx` - Update level completion
- [ ] `components/organisms/CodeEditorSection.tsx` - Update completion logic
- [ ] `components/organisms/PlayGameSection.tsx` - Update completion check
- [ ] `components/molecules/TopNavbar.tsx` - Replace connect button
- [ ] `components/organisms/WalletHeader.tsx` - Replace connect button

### Steps to Migrate

1. **Install Dependencies**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Update Imports**:
   - Replace `useGucoLevels` with `useGameService`
   - Replace `CustomConnectButton` with `UnifiedConnectButton`
   - Add `AuthModal` where needed

3. **Update Authentication Logic**:
   - Replace wallet address checks with user checks
   - Update error messages for both modes
   - Add proper loading states

4. **Update Environment Variables**:
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_WEB3_ENABLED` appropriately
   - Add Supabase credentials for REST mode

5. **Test Both Modes**:
   ```bash
   # Test Web3 mode
   NEXT_PUBLIC_WEB3_ENABLED=true npm run dev
   
   # Test REST mode
   NEXT_PUBLIC_WEB3_ENABLED=false npm run dev
   ```

## Common Patterns

### Conditional Rendering Based on Mode

```tsx
const { isWeb3Mode } = useGameService();

return (
  <div>
    {isWeb3Mode ? (
      <p>Connect your wallet to interact with the blockchain</p>
    ) : (
      <p>Login to save your progress</p>
    )}
  </div>
);
```

### Error Handling

```tsx
const { error, isWeb3Mode } = useGameService();

const getErrorMessage = (error: string) => {
  if (isWeb3Mode) {
    if (error.includes('wallet')) return 'Please connect your wallet';
    if (error.includes('gas')) return 'Transaction failed - not enough gas';
  } else {
    if (error.includes('auth')) return 'Please login to continue';
    if (error.includes('network')) return 'Network error - please try again';
  }
  return error;
};
```

### Loading States

```tsx
const { isLoading, isWeb3Mode } = useGameService();

return (
  <Button disabled={isLoading}>
    {isLoading 
      ? (isWeb3Mode ? 'Processing transaction...' : 'Saving...') 
      : 'Submit'
    }
  </Button>
);
```

This migration ensures that your components work seamlessly with both Web3 and REST API versions while maintaining a consistent user experience.