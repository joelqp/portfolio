import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentProps } from 'react';
import styles from './Switch.module.css';

export type SwitchProps = Omit<
  ComponentProps<typeof BaseSwitch.Root>,
  'children' | 'className'
> & {
  label: string;
};

export function Switch({ label, ...props }: SwitchProps) {
  return (
    <label className={styles.label}>
      <BaseSwitch.Root {...props} className={styles.control}>
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      <span>{label}</span>
    </label>
  );
}
