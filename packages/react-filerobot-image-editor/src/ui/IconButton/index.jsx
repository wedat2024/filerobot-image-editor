import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './IconButton.module.css';

const IconButton = forwardRef(
  ({ children, className, active = false, ...props }, ref) => (
    <button
      type="button"
      {...props}
      ref={ref}
      data-active={active || undefined}
      className={cx(
        styles.button,
        'SfxButton-root',
        'SfxIconButton-root',
        className,
      )}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = 'IconButton';
IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  active: PropTypes.bool,
};

export default IconButton;
