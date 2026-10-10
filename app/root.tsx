import type { ReactNode } from 'react';
import { Links, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { SiteLayout } from './components/SiteLayout/SiteLayout';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/utilities.css';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Portfolio</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  );
}
