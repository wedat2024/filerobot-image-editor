import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './MenuSurface.module.css';

const MenuSurface = forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(styles.menu, 'SfxMenu-root', className)}
  />
));

MenuSurface.displayName = 'MenuSurface';
MenuSurface.defaultProps = { className: undefined };
MenuSurface.propTypes = { className: PropTypes.string };

export default MenuSurface;
