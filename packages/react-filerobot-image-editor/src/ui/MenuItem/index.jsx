import React, { forwardRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import styles from './MenuItem.module.css';

const MenuItem = forwardRef(
  (
    {
      children,
      icon,
      active,
      className,
      iconClassName,
      wrapLabel,
      role,
      tabIndex,
      ...props
    },
    ref,
  ) => (
    <div className="SfxMenuItem-wrapper" role="presentation">
      <button
        {...props}
        ref={ref}
        type="button"
        role={role}
        tabIndex={tabIndex}
        data-active={active || undefined}
        className={cx(styles.item, 'SfxMenuItem-root', className)}
      >
        {icon && (
          <span
            aria-hidden="true"
            className={cx(styles.icon, 'SfxMenuItem-Icon', iconClassName)}
          >
            {icon}
          </span>
        )}
        {wrapLabel ? (
          <span className={cx(styles.label, 'SfxMenuItem-Label')}>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    </div>
  ),
);

MenuItem.displayName = 'MenuItem';
MenuItem.defaultProps = {
  children: null,
  wrapLabel: true,
  role: 'menuitem',
  tabIndex: -1,
  icon: null,
  active: false,
  className: undefined,
  iconClassName: undefined,
};
MenuItem.propTypes = {
  children: PropTypes.node,
  wrapLabel: PropTypes.bool,
  role: PropTypes.string,
  tabIndex: PropTypes.number,
  icon: PropTypes.node,
  active: PropTypes.bool,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
};

export default MenuItem;
