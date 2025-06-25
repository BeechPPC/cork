import { createRoot } from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react';
import App from "./App";
import "./index.css";
import { clerkPubKey, isClerkConfigured } from './lib/clerk';

const AppWithClerk = () => {
  if (!isClerkConfigured) {
    console.warn('Clerk not configured, running without authentication');
    return <App />;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  );
};

createRoot(document.getElementById("root")!).render(<AppWithClerk />);
