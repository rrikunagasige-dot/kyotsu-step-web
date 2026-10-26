import {defineConfig} from 'vitest/config';
export default defineConfig({esbuild:{jsx:'automatic'},test:{environment:'jsdom',testTimeout:20000,include:['work/items/W-MATH-039-n08-grouped-transformations/implementation.test.tsx']}});
