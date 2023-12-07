import { Link } from "nextra-theme-docs";
import Image from 'next/image';
import styles from './index.module.css'

export const FiddleLink = ({ label, href }: { label: string, href: string }) => {
  const tip = `RealChart example for ${label} | jsfiddle`
  return (
    <div>
      <Link href={href} className={styles.link} title={tip} aria-label={label}>
        <Image width={24} height={16.4} src="/images/jsfiddle.svg" alt={tip} className={styles.img}/>
        {' ' + label}
      </Link>
    </div>
  );
};
