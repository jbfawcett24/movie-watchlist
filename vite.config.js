import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    root: "src/",

    build: {
        outDir: "../dist",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                search: resolve(__dirname, "src/search.html"),
                movie: resolve(__dirname, "src/movie.html"),
                spinner: resolve(__dirname, "src/spinner.html"),
                share: resolve(__dirname, "src/share.html")
            }
        }
    }
});
