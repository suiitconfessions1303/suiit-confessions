import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "production") {
    const apiUrl = loadEnv(mode, '.', 'VITE_').VITE_API_URL;

    if (!apiUrl) {
      throw new Error("VITE_API_URL is required for production builds");
    }

    if (!apiUrl.startsWith("https://")) {
      throw new Error("VITE_API_URL must use HTTPS in production");
    }
  }

  return {
    plugins: [react()],
    build: {
      sourcemap: false,
    },
    server: {
      port: 6969, // Change this to whatever port you want (e.g., 3000, 3001, etc.)
    },
  };
});
