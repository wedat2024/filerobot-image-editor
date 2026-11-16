/** External Dependencies */
import { forwardRef, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import LabelView from 'ui/Label';
import getLabelStyles from './getLabelStyles';

const Label = forwardRef(
  (
    {
      children = null,
      size = 'md',
      error = false,
      disabled = false,
      style,
      ...props
    },
    ref,
  ) => {
    const {
      theme: { palette, typography },
    } = useStore();
    const font =
      typography.font[size === 'sm' ? 'label-small' : 'label-medium'];
    const textRef = useRef(null);
    const [truncated, setTruncated] = useState(false);

    const updateTooltip = () => {
      if (textRef.current) {
        setTruncated(textRef.current.offsetWidth < textRef.current.scrollWidth);
      }
    };

    return (
      <LabelView
        {...props}
        ref={ref}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        style={getLabelStyles({ font, palette, error, disabled, style })}
        textProps={{
          ref: textRef,
          onMouseOver: updateTooltip,
          title:
            truncated && typeof children === 'string' ? children : undefined,
        }}
      >
        {children}
      </LabelView>
    );
  },
);

Label.displayName = 'Label';
Label.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md']),
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
};

export default Label;
