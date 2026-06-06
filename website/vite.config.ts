import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL("../", import.meta.url).pathname);

  return {
    base: env.VITE_BASE_PATH || "/",
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL("./index.html", import.meta.url)),
          about: fileURLToPath(new URL("./about/index.html", import.meta.url)),
          bigFive: fileURLToPath(
            new URL("./instrument/big-five/index.html", import.meta.url),
          ),
          bisBas: fileURLToPath(
            new URL("./instrument/bis-bas/index.html", import.meta.url),
          ),
          barchardEi: fileURLToPath(
            new URL("./instrument/barchard-ei/index.html", import.meta.url),
          ),
          viaIs: fileURLToPath(
            new URL("./instrument/via-is/index.html", import.meta.url),
          ),
          traitEi: fileURLToPath(
            new URL("./instrument/trait-ei/index.html", import.meta.url),
          ),
        },
      },
    },
    server: {
      host: "0.0.0.0", // allows LAN access
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
