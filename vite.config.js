import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server settings
  server: {
    port: 5173,
    host: true,        // Network access
    open: false,       // Auto-open browser (Acode-এ false ভালো)
    strictPort: false,
  },
  
  // Build settings
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['lucide-react', 'framer-motion'],
          'charts': ['recharts'],
        },
      },
    },
  },
  
  // Preview server
  preview: {
    port: 4173,
    host: true,
  },
  
  // Resolve settings
  resolve: {
    alias: {
      // আপনি চাইলে @ দিয়ে src অ্যাক্সেস করতে পারবেন
      // '@': '/src',
    },
  },
  
  // Optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
})