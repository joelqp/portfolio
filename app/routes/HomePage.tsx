import { Link } from 'react-router';
import { Button } from '../components/Button/Button';
import { homeContent } from '../content/homeContent';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.identity}>
        <h1 className={styles.name}>{homeContent.name}</h1>
        <p className={styles.role}>{homeContent.role}</p>
      </header>

      <section className={styles.about} aria-labelledby="about-title">
        <div className={styles.textBlock}>
          <h2 id="about-title">{homeContent.aboutTitle}</h2>
          <p>{homeContent.aboutText}</p>
        </div>
      </section>

      <div className={styles.invitation}>
        <p className={styles.textBlock}>{homeContent.invitation}</p>
      </div>

      <div className={styles.journey}>
        <Button
          render={<Link to="/profile" />}
          nativeButton={false}
          className={styles.journeyButton}
        >
          {homeContent.journeyLabel}
        </Button>
      </div>
    </div>
  );
}
