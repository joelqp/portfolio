import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className'> & {
  variant?: ButtonVariant;
  className?: string;
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      className={`${styles.button} ${styles[variant]} ${className}`}
    />
  );
}
