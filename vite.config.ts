import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/community-articles/",
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router"],
          markdown: ["react-markdown", "remark-gfm"],
          highlight: ["@wooorm/starry-night"],
          hastUtils: ["hast-util-to-html"],
          styles: ["github-markdown-css"],
        },
      },
    },
    chunkSizeWarningLimit: 1400,
  },
});
