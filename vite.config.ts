import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["frontend.xaosao.com"],
  },
  // plugins: [react(), basicSsl()],
  server: {
    host: true,
  },
});
