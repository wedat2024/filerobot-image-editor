/** External Dependencies */
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Select from 'components/common/Select';
import useFieldId from 'hooks/useFieldId';

/** Internal Dependencies */
import FieldGroup from 'ui/FieldGroup';
import Label from 'components/common/Label';

// Legacy SelectGroup uses a medium label even when its Select is small.
const SelectGroup = forwardRef(({ label, className, ...props }, ref) => {
  const id = useFieldId();

  return (
    <FieldGroup ref={ref} className={cx('SfxSelectGroup-root', className)}>
      {label && (
        <Label id={`${id}-label`} htmlFor={id}>
          {label}
        </Label>
      )}
      <Select
        {...props}
        id={id}
        aria-labelledby={label ? `${id}-label` : undefined}
      />
    </FieldGroup>
  );
});

SelectGroup.displayName = 'SelectGroup';
SelectGroup.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
};

export default SelectGroup;
