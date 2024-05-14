import { defineConfig } from "vite";
import autoOrigin from "vite-plugin-auto-origin";

export default defineConfig({
    plugins: [autoOrigin()],
});
