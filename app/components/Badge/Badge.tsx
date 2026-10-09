import type { ComponentProps } from 'react';
import styles from './Badge.module.css';

export function Badge({ className = '', ...props }: ComponentProps<'span'>) {
  return <span {...props} className={`${styles.badge} ${className}`} />;
}
