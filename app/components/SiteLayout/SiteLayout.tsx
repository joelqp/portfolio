import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Header } from '../Header/Header';
import { usePageScrollNavigation } from '../../navigation/usePageScrollNavigation';
import styles from './SiteLayout.module.css';

export function SiteLayout({ children }: { children: ReactNode }) {
  usePageScrollNavigation();
  const { pathname, hash, key } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousLocation = useRef({ pathname, key });

  useEffect(() => {
    const pageChanged = previousLocation.current.pathname !== pathname;
    const navigationChanged = previousLocation.current.key !== key;

    if (navigationChanged && (pageChanged || !hash)) {
      mainRef.current?.focus({ preventScroll: true });
    }

    previousLocation.current = { pathname, key };
  }, [pathname, hash, key]);

  return (
    <div className={styles.layout}>
      <Header />
      <main
        id="contenido"
        ref={mainRef}
        tabIndex={-1}
        className={styles.main}
      >
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
