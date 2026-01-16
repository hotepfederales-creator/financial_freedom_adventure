import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.finmon.app',
    appName: 'FinMon: Budget Battler',
    webDir: 'dist',
    server: {
        // REPLACE THIS with your computer's local IP address (e.g., 192.168.1.5:3000)
        // Run 'ipconfig' (Windows) or 'ifconfig' (Mac) to find it.
        url: 'http://192.168.3.173:3000',
        cleartext: true // Allows http (non-https) for local dev
    }
};

export default config;
