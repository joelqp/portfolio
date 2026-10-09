import { useId, type ComponentProps } from 'react';
import styles from './TextField.module.css';

export type TextFieldProps = ComponentProps<'input'> & {
  label: string;
  hint?: string;
};

export function TextField({
  label,
  hint,
  id,
  className = '',
  'aria-describedby': describedBy,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const descriptionIds = [describedBy, hint ? hintId : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>{label}</label>
      <input
        {...props}
        id={inputId}
        aria-describedby={descriptionIds || undefined}
        className={`${styles.input} ${className}`}
      />
      {hint && <p id={hintId} className={styles.hint}>{hint}</p>}
    </div>
  );
}
