import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ArrowBottom from '@scaleflex/icons/arrow-bottom';

import styles from './SelectTrigger.module.css';

const SelectTrigger = forwardRef(
  (
    { children, hasValue, placeholder, className, fullWidth, ...props },
    ref,
  ) => (
    <div
      className={cx(styles.container, 'SfxSelect-Container')}
      data-full-width={fullWidth || undefined}
    >
      <button
        {...props}
        ref={ref}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={props['aria-controls']}
        aria-expanded={props['aria-expanded']}
        className={cx(
          styles.trigger,
          'SfxInput-root',
          'SfxSelect-root',
          className,
        )}
        data-full-width={fullWidth || undefined}
      >
        <span
          className={cx(
            styles.label,
            hasValue ? 'SfxSelect-Label' : 'SfxSelect-Placeholder',
          )}
        >
          {hasValue ? children : placeholder}
        </span>
        <span aria-hidden="true" className={cx(styles.icon, 'SfxSelect-Icon')}>
          <span className={styles.arrow}>
            <ArrowBottom size={10} />
          </span>
        </span>
      </button>
    </div>
  ),
);

SelectTrigger.displayName = 'SelectTrigger';
SelectTrigger.defaultProps = {
  'aria-controls': undefined,
  'aria-expanded': false,
  children: null,
  hasValue: false,
  placeholder: '',
  className: undefined,
  fullWidth: false,
};
SelectTrigger.propTypes = {
  'aria-controls': PropTypes.string,
  'aria-expanded': PropTypes.bool,
  children: PropTypes.node,
  hasValue: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default SelectTrigger;
