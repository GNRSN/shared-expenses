import { fileURLToPath, URL } from "url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    // alias: {
    //   "@": fileURLToPath(new URL("./node_modules/@/", import.meta.url)),
    // },
  },
  test: {
    globals: true,
    server: {
      deps: {
        inline: ["next", "@/db"],
      },
    },
  },
});
