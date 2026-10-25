import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],test:{environment:'jsdom',include:['work/items/W-MATH-032-n07-semantic-repair/renderer.test.tsx']}});
