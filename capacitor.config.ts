import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'mf-ecommerce-app',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true,
    hostname: '192.168.1.40',
  },
  android: {
    path: 'android',
  },
};

export default config;
