import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
//@ts-ignore
import manifest from './manifest.config'

import { nodePolyfills } from 'vite-plugin-node-polyfills'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    nodePolyfills({
      include: [
        'stream',
        'https',
        'http',
      ],
    }),
    commonjs(),
  ],
  build: {
    minify: false,
  },
})