import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './PopupTrigger.module.css';

const PopupTrigger = forwardRef(({ className, ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    type="button"
    className={cx(styles.button, className)}
  />
));

PopupTrigger.displayName = 'PopupTrigger';
PopupTrigger.defaultProps = { className: undefined };
PopupTrigger.propTypes = { className: PropTypes.string };

export default PopupTrigger;
