import react from "@vitejs/plugin-react";
import { defineConfig, PluginOption } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";


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

  
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(), fixRecastPlugin],
    server: {
        host: '0.0.0.0',
        port:5173
    },
    optimizeDeps: {
      exclude: ['@babylonjs/havok'],
  },
});
