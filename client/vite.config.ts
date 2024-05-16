import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { PluginOption } from 'vite';

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
  plugins: [react(),fixRecastPlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
