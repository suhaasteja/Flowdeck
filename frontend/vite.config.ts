import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [
    wasm(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Flowdeck — Workcell Operator Console',
        short_name: 'Flowdeck',
        description: 'Browser-based HMI for a simulated UR5 robot arm performing pick-and-place',
        theme_color: '#ffffff',
        background_color: '#f5f5f7',
        display: 'standalone',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Cache the app shell and all static assets
        globPatterns: ['**/*.{js,css,html,svg,ico,woff,woff2,wasm}'],
        navigateFallback: 'index.html',
        // Cache URDF meshes if they exist
        runtimeCaching: [
          {
            urlPattern: /\/urdf\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'urdf-meshes',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'three':  ['three'],
          'r3f':    ['@react-three/fiber', '@react-three/drei'],
          'react':  ['react', 'react-dom'],
          'vendor': ['zustand', 'lucide-react'],
        },
      },
    },
  },
})
