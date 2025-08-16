import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@reactflow/core',
      '@reactflow/background',
      '@reactflow/controls',
      '@reactflow/minimap',
      'emoji-mart'
    ],
    force: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          reactflow: ['@reactflow/core', '@reactflow/background', '@reactflow/controls', '@reactflow/minimap'],
          emoji: ['emoji-mart']
        }
      }
    }
  }
}));
