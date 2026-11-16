/** External Dependencies */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import ButtonView from 'ui/Button';

const padding = {
  'link-secondary': { sm: '0px', md: '0px' },
  'link-basic-secondary': { sm: '0px', md: '0px' },
  primary: { sm: '8px 12px', md: '11px 16px' },
  secondary: { sm: '7px 12px', md: '10px 16px' },
  basic: { sm: '8px 12px', md: '11px 16px' },
  'warning-primary': { sm: '8px 12px', md: '11px 16px' },
};

// Adapt the editor theme and legacy ButtonWithMenu props outside the UI primitive.
const Button = forwardRef(({ color, size, style, ...props }, ref) => {
  const { theme } = useStore();
  const { palette, shape, typography } = theme;

  const variables = {
    '--fie-button-background':
      color === 'secondary'
        ? palette['bg-stateless']
        : palette['accent-stateless'],
    '--fie-button-secondary-color': palette['accent-stateless'],
    '--fie-button-focus-background': palette.accent_1_2_opacity,
    '--fie-button-hover': palette['accent-primary-hover'],
    '--fie-button-active': palette['accent-primary-active'],
    '--fie-button-disabled-background': palette.accent_1_2_opacity,
    '--fie-button-color': palette['btn-primary-text'],
    '--fie-button-disabled-color': palette['borders-disabled'],
    '--fie-button-radius': shape.borderRadius.md,
    '--fie-button-focus-outline': palette['accent-primary'],
    '--fie-button-padding': padding[color][size],
    '--fie-button-icon-gap': size === 'sm' ? '6px' : '7px',
  };

  if (color === 'link-basic-secondary' || color === 'link-secondary') {
    Object.assign(variables, {
      '--fie-button-background': 'transparent',
      '--fie-button-color': palette['link-stateless'],
      '--fie-button-disabled-background': 'transparent',
    });
  } else if (color === 'basic') {
    Object.assign(variables, {
      '--fie-button-background': 'transparent',
      '--fie-button-color': palette['link-stateless'],
      '--fie-button-border': palette['borders-button'],
      '--fie-button-hover': palette['bg-hover'],
      '--fie-button-active': palette['bg-active'],
      '--fie-button-hover-color': palette['link-hover'],
    });
  } else if (color === 'warning-primary') {
    Object.assign(variables, {
      '--fie-button-background': palette.warning,
      '--fie-button-hover': palette['warning-hover'],
      '--fie-button-active': palette['warning-active'],
    });
  }

  return (
    <ButtonView
      {...props}
      ref={ref}
      variant={color}
      style={{ ...variables, ...style }}
      labelStyle={{
        ...typography.font[size === 'md' ? 'btn-lg' : 'btn-md'],
        ...(color === 'link-basic-secondary' && { fontWeight: 400 }),
      }}
    />
  );
});

Button.displayName = 'Button';
Button.defaultProps = { color: 'primary', size: 'sm', style: undefined };
Button.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'basic',
    'warning-primary',
    'link-basic-secondary',
    'link-secondary',
  ]),
  size: PropTypes.oneOf(['sm', 'md']),
  style: PropTypes.instanceOf(Object),
};

export default Button;
