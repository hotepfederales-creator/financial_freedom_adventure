import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Expose API Key safely to the client (ensure you treat this key as public if used on client)
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Polyfill process.env to avoid ReferenceError in some libraries
      'process.env': {}
    }
  };
});