import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './CrossButton.module.css';

const CrossButton = forwardRef(({ children, className, ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    type="button"
    className={cx(styles.button, 'SfxCrossButton-root', className)}
  >
    {children}
  </button>
));

CrossButton.displayName = 'CrossButton';
CrossButton.defaultProps = { className: undefined };
CrossButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default CrossButton;
