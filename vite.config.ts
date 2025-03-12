import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 515,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf("node_modules/react/") !== -1) {
            return;
          } else if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'script-defer',
    includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],

    manifest: {
      name: "CJ's Pick List",
      short_name: "Pick List",
      description: "Effortlessly create, edit, and manage lists in an instant with CJ's Pick List.",
      theme_color: "#19192d",
      background_color: "#19192d",
      scope: "/",
      start_url: "/",
      display: "standalone",
      orientation: "portrait-primary",

      icons: [
        {
          src: "/assets/icon/apple-touch-icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/assets/icon/apple-touch-icon-180x180.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/assets/icon/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "/assets/icon/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
  server: {
    port: 3077,
  },
})
