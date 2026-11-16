/** External Dependencies */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import useFieldId from 'hooks/useFieldId';
import FieldGroup from 'ui/FieldGroup';
import Input from 'components/common/Input';
import Label from 'components/common/Label';

const InputGroup = forwardRef(
  (
    { label, size, error, errorMessage, disabled, inputProps, ...props },
    ref,
  ) => {
    const generatedId = useFieldId();
    const id = inputProps?.id || props.id || generatedId;
    const errorId = `${id}-error`;
    const hasErrorMessage = error && Boolean(errorMessage);
    const description =
      [
        inputProps?.['aria-describedby'] || props['aria-describedby'],
        hasErrorMessage && errorId,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <FieldGroup ref={ref}>
        {label && (
          <Label htmlFor={id} size={size} error={error} disabled={disabled}>
            {label}
          </Label>
        )}
        <Input
          {...props}
          size={size}
          error={error}
          disabled={disabled}
          inputProps={{ ...inputProps, id, 'aria-describedby': description }}
        />
        {hasErrorMessage && (
          <span hidden id={errorId}>
            {errorMessage}
          </span>
        )}
      </FieldGroup>
    );
  },
);

InputGroup.displayName = 'InputGroup';
InputGroup.defaultProps = {
  label: undefined,
  size: 'md',
  error: false,
  errorMessage: undefined,
  disabled: false,
  inputProps: undefined,
  id: undefined,
  'aria-describedby': undefined,
};
InputGroup.propTypes = {
  label: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md']),
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  inputProps: PropTypes.instanceOf(Object),
  id: PropTypes.string,
  'aria-describedby': PropTypes.string,
};

export default InputGroup;
