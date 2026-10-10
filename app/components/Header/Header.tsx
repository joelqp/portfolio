import { useRef } from 'react';
import { NavLink, useLocation } from 'react-router';
import { navigationItems } from '../../navigation';
import { useProfileSectionNavigation } from '../../navigation/useProfileSectionNavigation';
import { useActiveProfileSection } from '../../navigation/useActiveProfileSection';
import { ProfileSubnavigation } from '../ProfileSubnavigation/ProfileSubnavigation';
import styles from './Header.module.css';

export function Header() {
  const { pathname } = useLocation();
  const isProfilePage = pathname === '/profile';
  const headerRef = useRef<HTMLElement>(null);
  useProfileSectionNavigation(headerRef);
  const activeSectionId = useActiveProfileSection(headerRef);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.inner}>
        <nav aria-label="Navegación principal">
          <ul className={styles.navigation}>
            {navigationItems.map(({ to, label }) => (
              <li key={to} className={styles.destination}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  <span className={styles.node} aria-hidden="true" />
                  <span className={styles.label}>{label}</span>
                </NavLink>
                {to === '/profile' && isProfilePage && (
                  <ProfileSubnavigation activeSectionId={activeSectionId} />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
