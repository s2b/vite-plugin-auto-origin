const defineConfig = require("vite").defineConfig;
const autoOrigin = require("vite-plugin-auto-origin").default;

module.exports = defineConfig({
    plugins: [autoOrigin()],
});
