import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const dsRoot = path.resolve(__dirname, '..', 'design-system')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ds': dsRoot,
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: ['.', dsRoot],
    },
  },
})
