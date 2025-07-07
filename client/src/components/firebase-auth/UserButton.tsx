import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { signOut, isFirebaseConfigured } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface UserButtonProps {
  afterSignOutUrl?: string;
  appearance?: {
    elements?: {
      avatarBox?: string;
    };
  };
}

export default function UserButton({
  afterSignOutUrl = '/',
  appearance,
}: UserButtonProps) {
  const { user, isAuthenticated } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast({
        title: 'Signed Out',
        description: 'You have been signed out successfully.',
      });
      if (afterSignOutUrl) {
        window.location.href = afterSignOutUrl;
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign Out Failed',
        description: 'There was an error signing you out.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  if (!isFirebaseConfigured()) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="w-4 h-4" />
      </Button>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button variant="ghost" size="sm">
        <User className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`p-0 h-8 w-8 rounded-full ${
            appearance?.elements?.avatarBox || ''
          }`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.profileImageUrl || undefined}
              alt={user.firstName || 'User'}
            />
            <AvatarFallback>
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-white dark:bg-gray-800 border dark:border-gray-700"
        align="end"
        forceMount
      >
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center cursor-pointer"
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? 'Signing Out...' : 'Sign Out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
