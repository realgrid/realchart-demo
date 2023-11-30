import styles from './index.module.css'

export const DefaultValue = ({ value, contents }: { value: string, contents: string }) => {
  const spcValues = ['null', 'undefined', 'true', 'false', 'NaN'];
  const color = spcValues.includes(value) ? 'var(--shiki-token-keyword)' : 
    /'.*'/.test(value) ? 'var(--shiki-token-string-expression)' : 'var(--shiki-color-text)';

  return (
    <p className={styles.default}>
      default: <span style={{ color, fontWeight: 700 }}>{value}</span> {contents}<br/>
    </p>
  );
};
