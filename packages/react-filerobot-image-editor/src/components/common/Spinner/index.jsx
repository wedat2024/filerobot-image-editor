/** External Dependencies */
import React from 'react';
import { Loading } from '@scaleflex/icons';

/** Internal Dependencies */
import styles from './Spinner.module.css';

const Spinner = () => (
  <div className={['FIE_spinner-wrapper', styles.wrapper].join(' ')}>
    <Loading
      className={styles.spinner}
      size={50}
      color="var(--fie-accent-stateless)"
    />
  </div>
);

export default Spinner;
