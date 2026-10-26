import {defineConfig} from 'vitest/config';
export default defineConfig({esbuild:{jsx:'automatic'},test:{testTimeout:20000,environment:'jsdom',include:['work/items/W-MATH-038-transformation-groups/implementation.test.tsx']}});
