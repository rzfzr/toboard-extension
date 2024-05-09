import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
//@ts-ignore
import manifest from './manifest.config'

import { nodePolyfills } from 'vite-plugin-node-polyfills'
//Polyfills needed for dev = stream, https, http

export default defineConfig({
  plugins: [react(),
  crx({ manifest }),
  nodePolyfills({
    include: [
      'stream',
      'https',
      'http',
      // 'util',
      // 'url',
      // 'buffer'
    ],
    overrides: {
      stream: 'stream-browserify',
      https: "https-browserify",
      http: "stream-http",
      // util: "util/",
      // url: "url/",
      // buffer: "buffer/",
    },
  })],
  build: {
    minify: false,
  },
})