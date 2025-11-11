 // vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 💡 Configuration added to explicitly handle 'remixicon-react'
  optimizeDeps: {
    // This tells Vite's pre-bundler (esbuild) to process this specific package 
    // and resolve its entry point, which often fixes packages with non-standard 
    // module exports that trip up the automatic scanner.
    include: [
      'remixicon-react',
    ],
  },
})