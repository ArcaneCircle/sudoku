import { webxdcViteConfig } from "@webxdc/vite-plugins";
import react from "@vitejs/plugin-react";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(
  webxdcViteConfig({
    plugins: [
      react(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          "react",
          "react-router-dom",
          { "usehooks-ts": ["useCounter", "useDarkMode"] },
        ],
        dts: true,
      }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  }),
);
