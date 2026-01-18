import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import posthog from 'posthog-js';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize analytics
    posthog.init('phc_n0v9W7iFV679MKsBCzLY7Cez6O4XR0xIrAYdlnO20BH', {
      api_host: 'https://app.posthog.com',
      // This automatically tracks "Rage Clicks" (when users click 3x fast in frustration)
      autocapture: true, 
    });
  }, []);

  return <Component {...pageProps} />;
}

// Global styles definitions matching original index.html
const GlobalStyles = () => (
  // @ts-ignore
  <style jsx global>{`
    :root {
      --bg-core: #0f172a;
      --bg-card: #1e293b;
      --accent-hp: #ef4444;
      --accent-xp: #3b82f6;
      --accent-gold: #fbbf24;
      --text-main: #f8fafc;
      --font-pixel: 'VT323', monospace;
      --font-data: 'Chakra Petch', sans-serif;
    }

    body {
      font-family: 'Chakra Petch', sans-serif;
      background-color: var(--bg-core);
    }

    h1, h2, h3, h4, .font-pixel {
      font-family: 'VT323', monospace;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    html {
      scroll-behavior: smooth;
    }

    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent; 
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1; 
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8; 
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out forwards;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .stripe-pattern {
      background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
      background-size: 1rem 1rem;
    }

    .btn-juicy {
      transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0px 4px 0px 0px rgba(0,0,0,0.5);
    }
    .btn-juicy:active {
      transform: translateY(4px);
      box-shadow: 0px 0px 0px 0px;
    }

    @keyframes floatUp {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
    }
    .floating-damage {
      position: absolute;
      animation: floatUp 1s ease-out forwards;
      font-family: 'VT323', monospace;
      font-size: 2.5rem;
      color: var(--accent-hp);
      text-shadow: 2px 2px 0px #000;
      pointer-events: none;
      z-index: 9999;
      font-weight: bold;
    }
  `}</style>
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FinQuest AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}