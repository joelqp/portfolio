import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import styles from './PageContent.module.css';

type PageContentProps = {
  introduction: string;
  children: ReactNode;
};

export function PageContent({ introduction, children }: PageContentProps) {
  return (
    <div className={styles.page}>
      <div className={styles.introduction}>
        <Badge>Contenido provisional</Badge>
        <p>{introduction}</p>
      </div>
      {children}
    </div>
  );
}
