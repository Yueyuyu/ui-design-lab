import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pulseLocalAssets } from './scripts/pulse-local-assets.mjs';

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.local-cache/pulse-bot/**', '**/.local-cache/pulse-desktop/**'] },
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), pulseLocalAssets()],
});
