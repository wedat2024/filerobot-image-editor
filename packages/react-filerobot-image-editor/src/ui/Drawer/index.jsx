import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './Drawer.module.css';

const Drawer = forwardRef(
  ({ open, children, className, onBackdropClick, style, ...props }, ref) => (
    <div
      className={cx(styles.temporary, 'SfxDrawer-temporary')}
      data-open={open}
      style={style}
    >
      {open && (
        <div
          role="presentation"
          className={cx(styles.backdrop, 'SfxBackdrop-root')}
          onClick={onBackdropClick}
        />
      )}
      <div
        {...props}
        ref={ref}
        className={cx(styles.drawer, 'SfxDrawer-root', className)}
      >
        {children}
      </div>
    </div>
  ),
);

Drawer.displayName = 'Drawer';
Drawer.defaultProps = { className: undefined, style: undefined };
Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onBackdropClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
};

const createPart = (Element, name) => {
  const Part = ({ children }) => (
    <Element className={cx(styles[name], `SfxDrawer-${name}`)}>
      {children}
    </Element>
  );

  Part.displayName = `Drawer${name}`;
  Part.propTypes = { children: PropTypes.node.isRequired };

  return Part;
};

export const DrawerHeader = createPart('div', 'header');
export const DrawerBody = createPart('div', 'body');
export const DrawerList = createPart('ul', 'list');
export const DrawerItem = createPart('li', 'item');

export default Drawer;
