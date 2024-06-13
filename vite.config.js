import { defineConfig } from "vite";

export default defineConfig(({ command, mode, ssrBuild }) => {
    return {
        build: {
            cssMinify: false,
            minify: false,
        },
    }
});
