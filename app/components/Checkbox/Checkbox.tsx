import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { ComponentProps } from 'react';
import styles from './Checkbox.module.css';

export type CheckboxProps = Omit<
  ComponentProps<typeof BaseCheckbox.Root>,
  'children' | 'className'
> & {
  label: string;
};

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className={styles.label}>
      <BaseCheckbox.Root {...props} className={styles.control}>
        <BaseCheckbox.Indicator className={styles.indicator} aria-hidden="true">
          ✓
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <span>{label}</span>
    </label>
  );
}
