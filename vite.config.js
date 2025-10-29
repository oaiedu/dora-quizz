import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/dora-quizz/', // Replace with your GitHub repository name
  build: {
    outDir: 'dist'
  }
})
