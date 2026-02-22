import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'ea7594edaeb6693b-152-58-34-215.serveousercontent.com'
    ]
  }
})
