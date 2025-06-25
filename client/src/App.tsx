import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthWrapper, useAuth } from "@/components/auth-wrapper";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Cellar from "@/pages/cellar";
import Upload from "@/pages/upload";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import HelpCentre from "@/pages/help-centre";
import WineEducation from "@/pages/wine-education";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import AgeVerification from "@/pages/age-verification";
import ResponsibleDrinking from "@/pages/responsible-drinking";
import ReferralProgram from "@/pages/referral-program";
import WineryExplorer from "@/pages/winery-explorer";
import Checkout from "@/pages/checkout";
import Subscribe from "@/pages/subscribe";
import Subscription from "@/pages/subscription";

function Router() {
  const { isSignedIn, isLoaded, user } = useAuth();

  console.log("Router Auth State:", { isSignedIn, isLoaded, hasUser: !!user });

  // Show loading while authentication state is being determined
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Root route - redirect based on auth state */}
      <Route path="/">
        {isSignedIn ? <Dashboard /> : <Landing />}
      </Route>
      
      {/* Public routes - always accessible */}
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route path="/help-centre" component={HelpCentre} />
      <Route path="/wine-education" component={WineEducation} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/age-verification" component={AgeVerification} />
      <Route path="/responsible-drinking" component={ResponsibleDrinking} />
      <Route path="/referral-program" component={ReferralProgram} />
      <Route path="/checkout" component={Checkout} />
      
      {/* Protected routes - only accessible when signed in */}
      {isSignedIn && (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/cellar" component={Cellar} />
          <Route path="/upload" component={Upload} />
          <Route path="/winery-explorer" component={WineryExplorer} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/subscription" component={Subscription} />
        </>
      )}
      
      {/* Fallback routes */}
      <Route component={isSignedIn ? NotFound : Landing} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthWrapper>
            <Router />
            <Toaster />
          </AuthWrapper>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
