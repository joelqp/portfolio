import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('profile', 'routes/profile.tsx'),
  route('build', 'routes/build.tsx'),
  route('contact', 'routes/contact.tsx'),
] satisfies RouteConfig;
