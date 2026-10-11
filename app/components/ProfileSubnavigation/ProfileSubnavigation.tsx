import type { RefObject } from 'react';
import { Link } from 'react-router';
import { profileSectionItems } from '../../navigation/profileSections';
import { useActiveProfileSection } from '../../navigation/useActiveProfileSection';
import styles from './ProfileSubnavigation.module.css';

type ProfileSubnavigationProps = {
  headerRef: RefObject<HTMLElement | null>;
  navigationRef: RefObject<HTMLElement | null>;
};

export function ProfileSubnavigation({ headerRef, navigationRef }: ProfileSubnavigationProps) {
  const activeSectionId = useActiveProfileSection(headerRef);

  return (
    <nav ref={navigationRef} aria-label="Secciones de Perfil profesional" className={styles.subnavigation}>
      <ul className={styles.list}>
        {profileSectionItems.map(({ id, title }) => (
          <li key={id} className={styles.destination}>
            <Link
              to={`/profile#${id}`}
              className={styles.link}
              aria-current={activeSectionId === id ? 'location' : undefined}
            >
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.label}>{title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
