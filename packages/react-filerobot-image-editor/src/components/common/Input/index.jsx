/** External Dependencies */
import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import InputView from 'ui/Input';

// Editor theme and focus management stay outside the presentational input.
const Input = forwardRef(
  (
    {
      size,
      error,
      disabled,
      readOnly,
      fullWidth,
      focusOnMount,
      className,
      style,
      iconEnd,
      inputProps,
      ...props
    },
    ref,
  ) => {
    const {
      theme: { palette, shape, typography },
    } = useStore();
    const inputRef = useRef(null);

    const focusInput = () => {
      if (!disabled && !readOnly) inputRef.current?.focus();
    };

    useEffect(() => {
      if (focusOnMount) focusInput();
    }, []);

    const nativeProps = { ...props, ...inputProps };

    return (
      <InputView
        ref={ref}
        className={className}
        style={{
          '--fie-input-radius': shape.borderRadius.md,
          '--fie-input-color':
            palette[disabled ? 'txt-placeholder' : 'txt-primary'],
          '--fie-input-padding': size === 'sm' ? '8px 12px' : '11px 16px',
          '--fie-input-height': size === 'sm' ? '32px' : '40px',
          '--fie-input-hover-background': palette['bg-stateless'],
          '--fie-input-hover-border': palette['borders-primary-hover'],
          '--fie-input-focus-background': palette['bg-secondary'],
          '--fie-input-focus-border': palette['accent-stateless'],
          '--fie-input-error': palette.error,
          '--fie-input-placeholder': palette['txt-placeholder'],
          '--fie-input-icon': palette['icons-secondary'],
          '--fie-input-icon-hover': palette['icons-primary-hover'],
          '--fie-input-icon-focus': palette['icon-primary'],
          '--fie-input-icon-disabled': palette['icons-muted'],
          ...style,
        }}
        inputStyle={typography.font[size === 'sm' ? 'input-md' : 'input-lg']}
        inputProps={{
          ...nativeProps,
          type: nativeProps.type || 'text',
          placeholder: nativeProps.value ? '' : nativeProps.placeholder,
        }}
        inputRef={inputRef}
        endAdornment={iconEnd}
        onFocusRequest={focusInput}
        disabled={disabled}
        readOnly={readOnly}
        error={error}
        fullWidth={fullWidth}
      />
    );
  },
);

Input.displayName = 'Input';
Input.defaultProps = {
  size: 'md',
  error: false,
  disabled: false,
  readOnly: false,
  fullWidth: false,
  focusOnMount: false,
  className: undefined,
  style: undefined,
  iconEnd: null,
  inputProps: undefined,
};
Input.propTypes = {
  size: PropTypes.oneOf(['sm', 'md']),
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  fullWidth: PropTypes.bool,
  focusOnMount: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  iconEnd: PropTypes.node,
  inputProps: PropTypes.instanceOf(Object),
};

export default Input;
