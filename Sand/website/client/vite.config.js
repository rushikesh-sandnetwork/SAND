import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://sand-pbmk.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // esbuild: {
  //   jsxInject: `import React from 'react'`
  // }
})
