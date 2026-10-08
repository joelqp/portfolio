import type { Config } from '@react-router/dev/config';
export default {
  ssr: false,
  prerender: ['/', '/profile', '/build', '/contact'],
} satisfies Config;
