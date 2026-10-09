import { Link, NavLink } from 'react-router';
import styles from './Header.module.css';

const navigationItems = [
  { to: '/', label: 'Inicio' },
  { to: '/profile', label: 'Perfil profesional' },
  { to: '/build', label: 'Cómo lo construí' },
  { to: '/contact', label: 'Contacto' },
] as const;

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>Portfolio</Link>
        <nav aria-label="Navegación principal">
          <ul className={styles.navigation}>
            {navigationItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
