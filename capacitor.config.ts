import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finmon.trainer',
  appName: 'FinMon Trainer',
  webDir: '.next', // Points to Next.js build output
  server: {
    androidScheme: 'https'
  }
};

export default config;