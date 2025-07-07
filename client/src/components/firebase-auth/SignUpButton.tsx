import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signUp, isFirebaseConfigured, getCurrentUser } from '@/lib/auth';
import { useAuth } from '@/components/firebase-auth/AuthWrapper';
import ProfileSetupModal from '@/components/profile-setup-modal';
import { queryClient } from '@/lib/queryClient';

interface SignUpButtonProps {
  mode?: 'modal' | 'redirect';
  children: React.ReactNode;
}

export default function SignUpButton({
  mode = 'modal',
  children,
}: SignUpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isSignedIn, user, isLoaded } = useAuth();

  // Debug auth state changes
  useEffect(() => {
    console.log('🔍 SignUpButton: Auth state changed:', {
      isSignedIn,
      user: user?.id,
      isLoaded,
      timestamp: new Date().toISOString(),
    });
  }, [isSignedIn, user, isLoaded]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔍 SignUpButton: Starting registration process...');
      console.log('🔍 SignUpButton: Pre-registration auth state:', {
        isSignedIn,
        user: user?.id,
        isLoaded,
      });

      const credential = await signUp(
        email,
        password,
        firstName || undefined,
        lastName || undefined
      );

      console.log('🔍 SignUpButton: Account created successfully:', {
        userId: credential.user.uid,
        email: credential.user.email,
      });

      // Check Firebase auth state directly
      const currentUser = getCurrentUser();
      console.log('🔍 SignUpButton: Direct Firebase auth check:', {
        currentUser: currentUser?.uid,
        email: currentUser?.email,
      });

      toast({
        title: 'Success!',
        description: 'Your account has been created successfully.',
      });

      // Close modal and reset form
      setIsOpen(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');

      // Show profile setup modal
      setShowProfileSetup(true);
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign Up Failed',
        description:
          error.message || 'Please try again with different credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    // Invalidate user query to refresh profile status
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    toast({
      title: 'Welcome to Cork!',
      description: 'Your profile is complete. Enjoy your wine journey!',
    });
  };

  if (!isFirebaseConfigured()) {
    return <Button disabled>Get Started (Available on getcork.app)</Button>;
  }

  if (mode === 'modal') {
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>{children}</Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-slate">
                Create Your Cork Account
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name (Optional)</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name (Optional)</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-grape hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Profile Setup Modal */}
        <ProfileSetupModal
          open={showProfileSetup}
          onComplete={handleProfileSetupComplete}
        />
      </>
    );
  }

  // For redirect mode, just return the button
  return <Button>{children}</Button>;
}
