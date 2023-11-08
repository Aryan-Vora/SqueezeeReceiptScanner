import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.FIREBASE_KEY': JSON.stringify(process.env.FIREBASE_KEY),
    'process.env.OPENAI_KEY': JSON.stringify(process.env.OPENAI_KEY),
    // Add more variables as needed
  },

  // Other Vite config options...
});