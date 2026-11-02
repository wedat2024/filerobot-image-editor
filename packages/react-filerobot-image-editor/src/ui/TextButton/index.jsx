import React, { forwardRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import styles from './TextButton.module.css';

const TextButton = forwardRef(({ children, className, ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    type="button"
    className={cx(styles.button, 'SfxLabel-root', className)}
  >
    <span className={cx(styles.text, 'SfxLabel-text')}>{children}</span>
  </button>
));

TextButton.displayName = 'TextButton';
TextButton.defaultProps = { children: null, className: undefined };
TextButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default TextButton;
