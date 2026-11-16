import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import IconButtonView from 'ui/IconButton';

const padding = { sm: '9px', md: '12px', lg: '11px' };

// Adapt basic icon button sizes, including mobile navigation.
const IconButton = forwardRef(
  ({ color = 'basic', size = 'md', style, ...props }, ref) => {
    const {
      theme: { palette, shape },
    } = useStore();

    const variables = {
      '--fie-icon-button-radius': shape.borderRadius.md,
      '--fie-icon-button-padding': padding[size],
      '--fie-icon-button-color': palette['icon-primary'],
      '--fie-icon-button-hover-color': palette['icons-primary-hover'],
      '--fie-icon-button-hover-background': palette['bg-hover'],
      '--fie-icon-button-active-color': palette['link-active'],
      '--fie-icon-button-active-background': palette['bg-active'],
      '--fie-icon-button-disabled-color': palette['borders-disabled'],
    };

    return (
      <IconButtonView {...props} ref={ref} style={{ ...variables, ...style }} />
    );
  },
);

IconButton.displayName = 'IconButton';
IconButton.propTypes = {
  color: PropTypes.oneOf(['basic']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  style: PropTypes.instanceOf(Object),
};

export default IconButton;
