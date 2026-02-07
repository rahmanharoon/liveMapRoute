import React from 'react';
import styles from './styles.module.scss';

export interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return <div className={styles.layout}>{children}</div>;
};

export default Layout;
