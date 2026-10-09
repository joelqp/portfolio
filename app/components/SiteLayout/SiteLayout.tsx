import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Header } from '../Header/Header';
import styles from './SiteLayout.module.css';

export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      mainRef.current?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);

  return (
    <div className={styles.layout}>
      <a href="#contenido" className={styles.skipLink}>Saltar al contenido</a>
      <Header />
      <main
        id="contenido"
        ref={mainRef}
        tabIndex={-1}
        className={`container ${styles.main}`}
      >
        {children}
      </main>
    </div>
  );
}
