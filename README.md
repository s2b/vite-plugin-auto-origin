# Vite Auto Origin

Vite plugin that determines the `server.origin` property of the vite
dev server automatically based on previous requests from the vite client.

**This is still work in progress.**

## Usage

vite.config.js:

```js
import autoOrigin from 'vite-plugin-auto-origin';

export default defineConfig({
  plugins: [autoOrigin()],
  // ...
})
```