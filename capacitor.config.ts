
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bbb1814f596e4e66b3444f3d0b6fc484',
  appName: 'SwimTracker',
  webDir: 'dist',
  server: {
    url: 'https://bbb1814f-596e-4e66-b344-4f3d0b6fc484.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Add Android specific configuration
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      releaseType: null,
      signingType: null
    }
  }
};

export default config;
