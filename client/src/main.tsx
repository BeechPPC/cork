import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';
import { clerkPubKey, isClerkConfigured } from './lib/clerk';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);

// Always wrap in ClerkProvider if configured, otherwise render without
root.render(
  <React.StrictMode>
    {isClerkConfigured ? (
      <ClerkProvider
        publishableKey={clerkPubKey}
        // Add custom domain configuration for your Clerk instance
        domain="rare-akita-78.clerk.accounts.dev"
      >
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
