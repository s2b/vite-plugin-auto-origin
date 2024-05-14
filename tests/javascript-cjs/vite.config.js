const defineConfig = require("vite").defineConfig;
const autoOrigin = require("vite-plugin-auto-origin").default;

exports.default = defineConfig({
    plugins: [autoOrigin()],
});
