/** External Dependencies */
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/** Internal Dependencies */
import styles from './Button.module.css';

// Presentational button; editor theme adaptation lives in components.
const Button = forwardRef(
  (
    {
      children = null,
      startIcon = null,
      className = '',
      style = {},
      active = false,
      variant = 'primary',
      labelStyle = undefined,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        type="button"
        className={cx(
          styles.button,
          variant === 'secondary' && styles.secondary,
          variant === 'basic' && styles.basic,
          (variant === 'link-basic-secondary' ||
            variant === 'link-secondary') &&
            styles.link,
          'SfxButton-root',
          className,
        )}
        style={style}
        data-active={active || undefined}
      >
        <span className={cx(styles.body, 'SfxButton-Body')}>
          {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
          <span
            className={cx(styles.label, 'SfxButton-Label')}
            style={labelStyle}
          >
            {children}
          </span>
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';
Button.propTypes = {
  children: PropTypes.node,
  startIcon: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  active: PropTypes.bool,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'basic',
    'warning-primary',
    'link-basic-secondary',
    'link-secondary',
  ]),
  labelStyle: PropTypes.instanceOf(Object),
};

export default Button;
