import { defineConfig } from 'vitest/config';
import angular from '@angular-devkit/build-angular/vite/plugins/angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    browser: {
      enabled: true, // Set to true if you want to run tests in a real browser (e.g., Chrome, Firefox)
      name: 'chrome', // Browser name (e.g., 'chrome', 'edge', 'firefox', 'safari')
    },
  },
});
