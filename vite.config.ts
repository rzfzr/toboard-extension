import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { crx } from "@crxjs/vite-plugin"
//@ts-ignore
import manifest from "./manifest.config"

import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [
    crx({ manifest }),
    react(),
    nodePolyfills({
      include: ["stream", "https", "http"],
      globals: {
        process: true,
      },
    }),
  ],
  build: {
    minify: true,
  },
})
