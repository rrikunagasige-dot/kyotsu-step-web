import {defineConfig}from'vitest/config';
export default defineConfig({esbuild:{jsx:'automatic'},test:{environment:'jsdom',testTimeout:20000,include:['work/items/W-MATH-040-n08-construction-layout/*.test.{ts,tsx}']}});
