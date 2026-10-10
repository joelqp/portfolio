import { Link } from 'react-router';
import { profileSectionItems } from '../../navigation/profileSections';
import styles from './ProfileSubnavigation.module.css';

type ProfileSubnavigationProps = {
  activeSectionId: string | null;
};

export function ProfileSubnavigation({ activeSectionId }: ProfileSubnavigationProps) {
  return (
    <nav aria-label="Secciones de Perfil profesional" className={styles.subnavigation}>
      <ul className={styles.list}>
        {profileSectionItems.map(({ id, title }) => (
          <li key={id}>
            <Link
              to={`/profile#${id}`}
              className={styles.link}
              aria-current={activeSectionId === id ? 'location' : undefined}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
