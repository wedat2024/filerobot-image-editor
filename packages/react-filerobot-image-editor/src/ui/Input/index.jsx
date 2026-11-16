/** External Dependencies */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/** Internal Dependencies */
import styles from './Input.module.css';

// Focus management and editor theme adaptation belong to components/common.
const Input = forwardRef(
  (
    {
      className,
      style,
      inputStyle,
      inputProps,
      inputRef,
      endAdornment,
      onFocusRequest,
      disabled,
      readOnly,
      error,
      fullWidth,
    },
    ref,
  ) => (
    // The wrapper only forwards clicks to the native input; it is not a second control.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={ref}
      className={cx(styles.input, 'SfxInput-root', className)}
      style={style}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-error={error || undefined}
      data-full-width={fullWidth || undefined}
      onClick={onFocusRequest}
    >
      <div className={cx(styles.field, 'SfxInput-fieldWrapper')}>
        <input
          {...inputProps}
          ref={inputRef}
          disabled={disabled}
          aria-invalid={error || inputProps?.['aria-invalid'] || undefined}
          readOnly={readOnly}
          style={inputStyle}
          className={cx(styles.base, 'SfxInput-Base')}
        />
      </div>
      {endAdornment && (
        <span className={cx(styles.end, 'SfxInput-Icon')}>{endAdornment}</span>
      )}
    </div>
  ),
);

Input.displayName = 'Input';
Input.defaultProps = {
  className: undefined,
  style: undefined,
  inputStyle: undefined,
  inputProps: undefined,
  inputRef: undefined,
  endAdornment: null,
  onFocusRequest: undefined,
  disabled: false,
  readOnly: false,
  error: false,
  fullWidth: false,
};
Input.propTypes = {
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  inputStyle: PropTypes.instanceOf(Object),
  inputProps: PropTypes.instanceOf(Object),
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Object)]),
  endAdornment: PropTypes.node,
  onFocusRequest: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  error: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default Input;
