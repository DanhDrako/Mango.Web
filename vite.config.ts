import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1024, // Increase chunk size warning limit
    emptyOutDir: true, // Ensure the output directory is emptied before build
  },
  server: {
    port: 3000,
  },
  plugins: [react(), mkcert()],
});
