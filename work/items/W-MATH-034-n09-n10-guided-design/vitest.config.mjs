import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],test:{environment:'jsdom',include:['work/items/W-MATH-034-n09-n10-guided-design/implementation.test.tsx'],testTimeout:30000}});
