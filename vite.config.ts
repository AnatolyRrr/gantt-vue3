import { fileURLToPath, URL } from 'node:url'
import friendlyTypeImports from "rollup-plugin-friendly-type-imports";

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins =
    mode === "development"
      ? [vue(), friendlyTypeImports()]
      : [vue()];

  const resolve = {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL(".", import.meta.url)),
    },
  };

  const envDir = "./env";
  const envPrefix = "APP";

  if (mode === "gh-pages")
    return defineConfig({
      base: "/gantt-vue3/",
      build: {
        outDir: "docs",
      },
      envDir,
      envPrefix,
      plugins,
      resolve,
    });

  return defineConfig({
    envDir,
    envPrefix,
    plugins,
    resolve,
  });
})
