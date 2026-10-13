import type { ComponentProps } from 'react';
import styles from './Card.module.css';

export type CardProps = ComponentProps<'div'> & {
  variant?: 'raised' | 'outlined';
};

export function Card({
  variant = 'raised',
  className = '',
  ...props
}: CardProps) {
  return (
    <div {...props} className={`${styles.card} ${variant === 'outlined' ? styles.outlined : ''} ${className}`} />
  );
}
