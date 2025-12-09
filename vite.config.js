import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": {
        target: "https://cosplitz-backend.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ❗ Vite does NOT use "historyApiFallback"
  // The correct key is:
  build: {
    sourcemap: false,
  },

  preview: {
    // preview server options (does not use historyApiFallback)
  },
});
