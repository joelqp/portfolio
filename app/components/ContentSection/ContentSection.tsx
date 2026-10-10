import type { ReactNode } from 'react';
import styles from './ContentSection.module.css';

type ContentSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function ContentSection({ id, title, children }: ContentSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={styles.section}>
      <h2 id={`${id}-title`} tabIndex={-1} className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
