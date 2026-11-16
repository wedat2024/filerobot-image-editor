import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createPopper } from '@popperjs/core';
import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import MenuSurface from 'ui/MenuSurface';
import styles from './AnchoredMenu.module.css';

// Positioning and portal lifecycle belong to the common layer, not ui.
const AnchoredMenu = ({
  anchor,
  onClose,
  children,
  position,
  offset,
  surfaceRef,
  surface: Surface,
  overlay,
  style,
  ...props
}) => {
  const {
    theme: { palette, shape },
  } = useStore();
  const popperRef = useRef(null);
  const [portal] = useState(() => document.createElement('div'));

  useLayoutEffect(() => {
    let root = document.getElementById('SfxPopper');

    if (!root) {
      root = document.createElement('div');
      root.id = 'SfxPopper';
      document.body.appendChild(root);
    }

    root.appendChild(portal);

    return () => {
      portal.remove();
      if (!root.childNodes.length) root.remove();
    };
  }, [portal]);

  useLayoutEffect(() => {
    const element = popperRef.current;
    const updateWidth = () => {
      element.style.setProperty(
        '--fie-menu-width',
        `${anchor.getBoundingClientRect().width}px`,
      );
    };

    updateWidth();
    const popper = createPopper(anchor, element, {
      placement: position,
      modifiers: [{ name: 'offset', options: { offset: [0, offset] } }],
    });
    const onResize = () => {
      updateWidth();
      popper.update();
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      popper.destroy();
    };
  }, [anchor, position, offset]);

  return createPortal(
    <div className={styles.wrapper} style={{ zIndex: style?.zIndex }}>
      {/* The overlay dismisses the popup; keyboard dismissal is on its trigger. */}
      {overlay && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          className={styles.overlay}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          }}
        />
      )}
      <div ref={popperRef} className="SfxPopper-root">
        <Surface
          {...props}
          ref={surfaceRef}
          style={{
            '--fie-menu-radius': shape.borderRadius.md,
            '--fie-menu-shadow': palette['medium-shadow'],
            '--fie-menu-background': palette['bg-secondary'],
            '--fie-menu-color': palette['txt-primary'],
            '--fie-menu-active': palette['bg-active'],
            '--fie-menu-hover': palette['bg-hover'],
            '--fie-menu-focus': palette['accent-stateless'],
            '--fie-menu-icon': palette['icon-primary'],
            ...style,
          }}
        >
          {children}
        </Surface>
      </div>
    </div>,
    portal,
  );
};

AnchoredMenu.defaultProps = {
  position: 'bottom-start',
  offset: 0,
  surfaceRef: undefined,
  surface: MenuSurface,
  overlay: true,
  style: undefined,
};
AnchoredMenu.propTypes = {
  position: PropTypes.string,
  offset: PropTypes.number,
  surfaceRef: PropTypes.instanceOf(Object),
  surface: PropTypes.elementType,
  overlay: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  anchor: PropTypes.instanceOf(Element).isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default AnchoredMenu;
