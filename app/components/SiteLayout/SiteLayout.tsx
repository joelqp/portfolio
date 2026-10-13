import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Header } from '../Header/Header';
import { ProfileSubnavigation } from '../ProfileSubnavigation/ProfileSubnavigation';
import { usePageScrollNavigation } from '../../navigation/usePageScrollNavigation';
import { useNavigationDimensions } from '../../navigation/useNavigationDimensions';
import { useProfileSectionNavigation } from '../../navigation/useProfileSectionNavigation';
import { usePageScrollRestoration } from '../../navigation/usePageScrollRestoration';
import styles from './SiteLayout.module.css';
import transitionStyles from '../../styles/pageTransition.module.css';

export function SiteLayout({ children }: { children: ReactNode }) {
  const scrollLocationKey = usePageScrollNavigation();
  const { pathname, hash, key, state } = useLocation();
  const isProfilePage = pathname === '/profile';
  const reserveProfileBottom = isProfilePage && state?.scrollPageEntry === 'bottom';
  const layoutRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const profileNavigationRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const previousLocation = useRef({ pathname, key });
  useNavigationDimensions(layoutRef, headerRef, profileNavigationRef, isProfilePage);
  useProfileSectionNavigation(headerRef);
  usePageScrollRestoration(scrollLocationKey);

  useEffect(() => {
    const pageChanged = previousLocation.current.pathname !== pathname;
    const navigationChanged = previousLocation.current.key !== key;

    const arrivedFromScroll = scrollLocationKey.current === key;
    if (navigationChanged && !arrivedFromScroll && (pageChanged || !hash)) {
      mainRef.current?.focus({ preventScroll: true });
    }

    previousLocation.current = { pathname, key };
  }, [pathname, hash, key, scrollLocationKey]);

  return (
    <div data-page-scroll className={`${styles.frame} ${transitionStyles.transitionSurface}`}>
      <div ref={layoutRef} className={`${styles.layout} ${isProfilePage ? styles.profileLayout : ''}`}>
        <Header headerRef={headerRef} />
        <main
          id="contenido"
          ref={mainRef}
          tabIndex={-1}
          className={`${styles.main} ${isProfilePage ? styles.profileMain : ''} ${reserveProfileBottom ? styles.bottomEntry : ''}`}
        >
          <div className={styles.content}>{children}</div>
        </main>
        {isProfilePage && (
          <aside data-profile-panel className={styles.profileSidebar}>
            <ProfileSubnavigation headerRef={headerRef} navigationRef={profileNavigationRef} />
          </aside>
        )}
      </div>
    </div>
  );
}
