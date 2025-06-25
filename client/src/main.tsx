import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react';
import App from "./App";
import "./index.css";
import { clerkPubKey, isClerkConfigured } from './lib/clerk';

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);

if (isClerkConfigured) {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={clerkPubKey}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
