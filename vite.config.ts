import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
    tailwindcss(),
    tanstackStart({
      // https://react.dev/learn/react-compiler
      react: {
        babel: {
          plugins: [
            [
              "babel-plugin-react-compiler",
              {
                target: "19",
              },
            ],
          ],
        },
      },

      tsr: {
        quoteStyle: "double",
        semicolons: true,
        // verboseFileRoutes: false,
      },

      // Netlify deployment target
      target: "netlify",
    }),
  ],
});
