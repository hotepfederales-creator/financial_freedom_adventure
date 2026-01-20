import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import posthog from 'posthog-js';
import { UserProvider } from './context/UserContext';

// Initialize PostHog
posthog.init('phx_bJoihj9PmDiCTitlPaSacSG4dTXEmVl7U0O2WbfyTUobsW', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only'
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);