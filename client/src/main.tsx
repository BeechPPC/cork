import { createRoot } from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react';
import App from "./App";
import "./index.css";
import { clerkPubKey, isClerkConfigured } from './lib/clerk';

createRoot(document.getElementById("root")!).render(
  isClerkConfigured ? (
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  ) : (
    <App />
  )
);
