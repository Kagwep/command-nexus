import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { PluginOption } from 'vite';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import svgr from 'vite-plugin-svgr';

const fixRecastPlugin: PluginOption = {
  name: 'fix-recast',
  transform(code, id) {
    // Check if the current file is 'recast-detour.js'
    if (id.includes('recast-detour.js')) {
      // Replace 'this["Recast"]' with 'window["Recast"]'
      return code.replace(`this["Recast"]`, 'window["Recast"]');
    }
  }
};

export default defineConfig({
  plugins: [react(),wasm(),topLevelAwait(),svgr(),fixRecastPlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host:'0.0.0.0',
    port:5173
  },
  optimizeDeps: {
    exclude: ['@babylonjs/havok'],
},
})

