import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the main App component with SSR disabled.
// This is critical because the App relies on localStorage and window objects 
// which are not available on the server during Next.js build.
const AppWithNoSSR = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-slate-900 text-white font-mono">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="animate-pulse">Loading FinMon...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <AppWithNoSSR />;
}