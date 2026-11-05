import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tick from '@scaleflex/icons/tick';

import styles from './SelectOption.module.css';

const SelectOption = forwardRef(
  (
    {
      children = null,
      selected = false,
      highlighted = false,
      className,
      ...props
    },
    ref,
  ) => (
    <div className="SfxMenuItem-wrapper">
      <div
        {...props}
        ref={ref}
        role="option"
        aria-selected={selected}
        tabIndex={-1}
        data-highlighted={highlighted || undefined}
        className={cx(styles.option, 'SfxMenuItem-root', className)}
      >
        <span className={cx(styles.label, 'SfxMenuItem-Label')}>
          {children}
        </span>
        {selected && (
          <span
            className={cx(styles.actions, 'SfxMenuItem-Actions')}
            aria-hidden="true"
          >
            <span className={cx(styles.tick, 'SfxSelect-tickIcon')}>
              <Tick size={10} />
            </span>
          </span>
        )}
      </div>
    </div>
  ),
);

SelectOption.displayName = 'SelectOption';
SelectOption.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,
  highlighted: PropTypes.bool,
  className: PropTypes.string,
};

export default SelectOption;
