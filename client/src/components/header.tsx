import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  Wine,
  User,
  LogOut,
  ChevronDown,
  BookOpen,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'wouter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignInButton, SignUpButton, useClerk } from '@clerk/clerk-react';
import UserButton from '@/components/user-button';
import { isClerkConfigured } from '@/lib/clerk';
import { useState } from 'react';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';

export default function Header() {
  const { user: clerkUser, isAuthenticated } = useAuth();
  const { signOut } = useClerk();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch user data from backend API for subscription info
  const { data: user } = useAuthenticatedQuery(
    ['/api/auth/user'],
    async token => {
      const res = await fetch('/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
    {
      enabled: isAuthenticated, // Only fetch if authenticated
    }
  );

  // Use backend user data if available, fallback to Clerk user data
  const displayUser = user || clerkUser;

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    return location.startsWith(path) && path !== '/';
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? '/dashboard' : '/'}>
              <h1 className="text-2xl font-poppins font-bold text-grape dark:text-purple-400 cursor-pointer">
                cork
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Authenticated user navigation */}
            {isAuthenticated && (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className={`text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors ${
                      isActive('/dashboard')
                        ? 'text-grape dark:text-purple-400 font-medium'
                        : ''
                    }`}
                  >
                    Recommendations
                  </Button>
                </Link>
                <Link href="/cellar">
                  <Button
                    variant="ghost"
                    className={`text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors ${
                      isActive('/cellar')
                        ? 'text-grape dark:text-purple-400 font-medium'
                        : ''
                    }`}
                  >
                    My Cellar
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button
                    variant="ghost"
                    className={`text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors ${
                      isActive('/upload')
                        ? 'text-grape dark:text-purple-400 font-medium'
                        : ''
                    }`}
                  >
                    Upload Wine
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors ${
                        isActive('/winery-explorer') ||
                        isActive('/wine-education')
                          ? 'text-grape dark:text-purple-400 font-medium'
                          : ''
                      }`}
                    >
                      Explore
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white dark:bg-gray-800 border dark:border-gray-700"
                    align="center"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/winery-explorer"
                        className="flex items-center"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Winery Explorer</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/wine-education"
                        className="flex items-center"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Wine Education
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isClerkConfigured ? (
                  <>
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        className="text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors font-medium"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="bg-grape hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      disabled
                      className="text-slate dark:text-gray-200 opacity-50"
                    >
                      Sign In
                    </Button>
                    <Button
                      disabled
                      className="bg-grape opacity-50 text-white px-4 py-2 rounded-lg"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            ) : (
              /* User Menu */
              <div className="flex items-center space-x-3">
                <Badge
                  variant="secondary"
                  className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {displayUser?.subscriptionPlan === 'premium'
                    ? 'Premium'
                    : 'Free'}{' '}
                  Plan
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={displayUser?.profileImageUrl}
                          alt="Profile"
                        />
                        <AvatarFallback className="bg-grape dark:bg-purple-600 text-white text-sm">
                          {getInitials(
                            displayUser?.firstName,
                            displayUser?.lastName
                          )}
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
                        {displayUser?.firstName} {displayUser?.lastName}
                      </p>
                      <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
                        {displayUser?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/cellar" className="flex items-center">
                        <Wine className="mr-2 h-4 w-4" />
                        <span>My Cellar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/subscription" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Subscription</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1">
                      <UserButton afterSignOutUrl="/" showName={false} />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  Recommendations
                </Button>
              </Link>
              <Link href="/cellar">
                <Button variant="ghost" className="w-full justify-start">
                  My Cellar
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="ghost" className="w-full justify-start">
                  Upload Wine
                </Button>
              </Link>
              <Link href="/wine-education">
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Wine Education
                </Button>
              </Link>
              <Link href="/winery-explorer">
                <Button variant="ghost" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Winery Explorer
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" className="w-full justify-start">
                  Pricing
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
