import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import DrawerView from 'ui/Drawer';

// The editor uses an inline temporary drawer; editor focus and theme stay here.
const Drawer = ({ open, onClose, returnFocusRef, ...props }) => {
  const {
    theme: { palette, shadows },
  } = useStore();
  const drawerRef = useRef(null);
  const closeRef = useRef(onClose);

  closeRef.current = onClose;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const drawer = drawerRef.current;
    const previousFocus = document.activeElement;
    const getButtons = () => [
      ...drawer.querySelectorAll('button:not(:disabled)'),
    ];

    // Focus after the hidden drawer has become visible in layout.
    const focusFrame = requestAnimationFrame(() => {
      getButtons()[0]?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      } else if (event.key === 'Tab') {
        const buttons = getButtons();
        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !drawer.contains(document.activeElement))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !drawer.contains(document.activeElement))
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);

      const returnTarget = returnFocusRef?.current || previousFocus;

      if (returnTarget?.isConnected && returnTarget.getClientRects().length) {
        returnTarget.focus({ preventScroll: true });
      }
    };
  }, [open, returnFocusRef]);

  return (
    <DrawerView
      {...props}
      ref={drawerRef}
      open={open}
      role="dialog"
      aria-modal={open || undefined}
      onBackdropClick={onClose}
      onTransitionEnd={(event) => {
        const drawer = drawerRef.current;

        if (
          open &&
          event.target === drawer &&
          event.propertyName === 'transform' &&
          !drawer.contains(document.activeElement)
        ) {
          drawer
            .querySelector('button:not(:disabled)')
            ?.focus({ preventScroll: true });
        }
      }}
      style={{
        '--fie-drawer-background': palette['bg-stateless'],
        '--fie-drawer-overlay': palette['extra-0-3-overlay'],
        '--fie-drawer-shadow': shadows['left-panel-md'],
        '--fie-drawer-scrollbar': palette['icons-muted'],
        '--fie-drawer-scrollbar-track': palette['active-secondary'],
        '--fie-drawer-item-hover': palette['bg-active'],
        '--fie-drawer-accent': palette['accent-stateless'],
      }}
    />
  );
};

Drawer.propTypes = {
  returnFocusRef: PropTypes.shape({ current: PropTypes.instanceOf(Object) }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Drawer;
