import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Cellar from "@/pages/cellar";
import Upload from "@/pages/upload";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import HelpCentre from "@/pages/help-centre";
import WineEducation from "@/pages/wine-education";
import Checkout from "@/pages/checkout";
import Subscribe from "@/pages/subscribe";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isLoading || !isAuthenticated ? <Landing /> : <Dashboard />}
      </Route>
      
      {/* Public routes */}
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route path="/help-centre" component={HelpCentre} />
      <Route path="/wine-education" component={WineEducation} />
      <Route path="/checkout" component={Checkout} />
      
      {/* Protected routes */}
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/cellar" component={Cellar} />
          <Route path="/upload" component={Upload} />
          <Route path="/subscribe" component={Subscribe} />
        </>
      )}
      
      {/* Redirect unauthenticated users to landing */}
      {!isLoading && !isAuthenticated && (
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
