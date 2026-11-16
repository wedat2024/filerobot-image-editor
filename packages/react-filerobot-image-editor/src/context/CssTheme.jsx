import { forwardRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useStore } from 'hooks';

import styles from './Theme.module.css';

// Apply the same scope to the editor root and to content rendered in portals.
const ThemeScope = forwardRef(
  ({ as: Component = 'div', className, style, ...props }, ref) => {
    const { themeVariables } = useStore();

    return (
      <Component
        {...props}
        ref={ref}
        className={cx(
          styles.scope,
          themeVariables['--fie-icons-primary'] && styles.iconsOverride,
          className,
        )}
        style={{ ...themeVariables, ...style }}
      />
    );
  },
);

ThemeScope.displayName = 'ThemeScope';
ThemeScope.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
};

export default ThemeScope;
