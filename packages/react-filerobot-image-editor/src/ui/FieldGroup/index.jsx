/** External Dependencies */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/** Internal Dependencies */
import styles from './FieldGroup.module.css';

const FieldGroup = forwardRef(({ children, className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(styles.group, 'SfxInputGroup-root', className)}
  >
    {children}
  </div>
));

FieldGroup.displayName = 'FieldGroup';
FieldGroup.defaultProps = { children: null, className: undefined };
FieldGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default FieldGroup;
