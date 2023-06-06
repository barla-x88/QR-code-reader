import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("/home/ankit/certs/local.test.key"),
      cert: fs.readFileSync("/home/ankit/certs/local.test.crt"),
    },
  },
});
