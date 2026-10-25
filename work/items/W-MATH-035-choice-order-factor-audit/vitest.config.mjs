import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],test:{environment:'jsdom',include:['work/items/W-MATH-035-choice-order-factor-audit/implementation.test.tsx'],testTimeout:30000}});
