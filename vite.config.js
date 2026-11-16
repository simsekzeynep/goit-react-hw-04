import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "UNSPLASH_");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/search": {
          target: "https://api.unsplash.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/search/, "/search/photos"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (env.UNSPLASH_ACCESS_KEY) {
                proxyReq.setHeader(
                  "Authorization",
                  `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
                );
                proxyReq.setHeader("Accept-Version", "v1");
              }
            });
          },
        },
      },
    },
  };
});
