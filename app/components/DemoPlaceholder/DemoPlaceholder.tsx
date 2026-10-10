import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';
import styles from './DemoPlaceholder.module.css';

type DemoPlaceholderProps = {
  title: string;
  description: string;
};

export function DemoPlaceholder({ title, description }: DemoPlaceholderProps) {
  return (
    <Card variant="outlined" className={styles.placeholder}>
      <Badge>Demo pendiente</Badge>
      <h3 className={styles.title}>{title}</h3>
      <p>{description}</p>
      <p className={styles.notice}>
        Espacio reservado para una recreación personal con datos ficticios.
        La demo todavía no está implementada.
      </p>
    </Card>
  );
}
