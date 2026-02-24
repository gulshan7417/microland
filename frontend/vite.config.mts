import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Simple Vite config for React frontend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // Proxy API calls to the backend during development.
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});

