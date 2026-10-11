import type { RefObject } from 'react';
import { NavLink } from 'react-router';
import { navigationItems } from '../../navigation';
import styles from './Header.module.css';

const [homeDestination, ...sectionDestinations] = navigationItems;

export function Header({ headerRef }: { headerRef: RefObject<HTMLElement | null> }) {
  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.inner}>
        <nav aria-label="Navegación principal">
          <NavLink
            to={homeDestination.to}
            aria-label={`Joel / ${homeDestination.label}`}
            end
            className={({ isActive }) =>
              `${styles.brandLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.brandName}>Joel</span>
            <span aria-hidden="true">/</span>
            <span className={styles.homeLabel}>{homeDestination.label}</span>
          </NavLink>
          <ul className={styles.navigation}>
            {sectionDestinations.map(({ to, label }) => (
              <li key={to} className={styles.destination}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  <span className={styles.label}>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
