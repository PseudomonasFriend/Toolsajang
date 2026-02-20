import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // 테스트 환경: Node (계산 로직 전용, DOM 불필요)
    environment: 'node',
    // 글로벌 describe/it/expect 사용 가능
    globals: true,
    // 테스트 파일 경로 패턴
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
