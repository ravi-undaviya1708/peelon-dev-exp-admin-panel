import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "admin.peelon.co", // allow external access in dev
    port: 3002,
  },
  preview: {
    host: "admin.peelon.co", // allow external access in preview
    port: 3002,
    allowedHosts: ["https//:admin.peelon.co"], // allow all hosts/domains
  },
});
