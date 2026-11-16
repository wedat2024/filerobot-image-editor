/** External Dependencies */
import { forwardRef } from 'react';
import cx from 'classnames';

/** Internal Dependencies */
import styles from './HiddenUploadInput.module.css';

const HiddenUploadInput = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="file"
      ref={ref}
      {...props}
      className={cx(styles.hiddenInput, className)}
    />
  );
});

export default HiddenUploadInput;
