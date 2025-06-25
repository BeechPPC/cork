import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@clerk/clerk-react";
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
  const { isSignedIn, isLoaded, isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {!isLoaded || !isSignedIn ? <Landing /> : <Dashboard />}
      </Route>
      
      {/* Public routes */}
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
      
      {/* Protected routes */}
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
      
      {/* Redirect unauthenticated users to landing */}
      {isLoaded && !isSignedIn && (
        <Route path="*">
          <Landing />
        </Route>
      )}
      
      {/* 404 for authenticated users */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
