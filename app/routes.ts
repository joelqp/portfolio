import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/HomePage.tsx'),
  route('profile', 'routes/ProfilePage.tsx'),
  route('build', 'routes/BuildPage.tsx'),
  route('contact', 'routes/ContactPage.tsx'),
] satisfies RouteConfig;
