import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, Wine, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    return location.startsWith(path) && path !== "/";
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <h1 className="text-2xl font-poppins font-bold text-grape dark:text-purple-400 cursor-pointer">cork</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard">
                <Button 
                  variant="ghost" 
                  className={`text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors ${isActive('/dashboard') ? 'text-grape dark:text-purple-400 font-medium' : ''}`}
                >
                  Recommendations
                </Button>
              </Link>
              <Link href="/cellar">
                <Button 
                  variant="ghost" 
                  className={`text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors ${isActive('/cellar') ? 'text-grape dark:text-purple-400 font-medium' : ''}`}
                >
                  My Cellar
                </Button>
              </Link>
              <Link href="/upload">
                <Button 
                  variant="ghost" 
                  className={`text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors ${isActive('/upload') ? 'text-grape dark:text-purple-400 font-medium' : ''}`}
                >
                  Upload Wine
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  variant="ghost" 
                  className={`text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors ${isActive('/pricing') ? 'text-grape dark:text-purple-400 font-medium' : ''}`}
                >
                  Pricing
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={handleLogin}
                  className="text-slate dark:text-gray-200 hover:text-grape dark:hover:text-purple-400 transition-colors font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={handleLogin}
                  className="bg-grape hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Get Started
                </Button>
              </div>
            ) : (
              /* User Menu */
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {user?.subscriptionPlan === 'premium' ? 'Premium' : 'Free'} Plan
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt="Profile" />
                        <AvatarFallback className="bg-grape dark:bg-purple-600 text-white text-sm">
                          {getInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border dark:border-gray-700" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
                        {user?.email}
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
                      <Link href="/pricing" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Subscription</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
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
              <Link href="/pricing">
                <Button variant="ghost" className="w-full justify-start">
                  Pricing
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
