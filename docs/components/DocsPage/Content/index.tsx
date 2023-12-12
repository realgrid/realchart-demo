import styles from './index.module.css';

export const Content = ({ type, value }: { type: string, value: any }) => {
  return <span className={styles[type]}>{value}</span>;
};
