import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { useStore } from 'hooks';
import ThemeScope from 'context/CssTheme';
import DialogView from 'ui/Dialog';
import styles from './Dialog.module.css';

const FOCUSABLE =
  'button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]';
const openDialogs = [];
let preserveBodyClass = false;

const Dialog = ({ open, onClose, modalStyles, style, children, ...props }) => {
  const { theme } = useStore();
  const panel = useRef(null);
  const close = useRef(onClose);
  const [opener] = useState(() => document.activeElement);
  const { palette, shape } = theme;

  close.current = onClose;

  useEffect(() => {
    if (!open) return undefined;

    const surface = panel.current;
    if (!openDialogs.length) {
      preserveBodyClass = document.body.classList.contains('Modal-open');
    }

    openDialogs.push(surface);
    document.body.classList.add('Modal-open');

    if (!surface.contains(document.activeElement)) {
      (
        surface.querySelector('[data-dialog-initial-focus]') ||
        surface.querySelector(FOCUSABLE) ||
        surface
      ).focus({ preventScroll: true });
    }

    const onKeyDown = (event) => {
      if (
        event.defaultPrevented ||
        openDialogs[openDialogs.length - 1] !== surface
      )
        return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close.current();
      } else if (event.key === 'Tab' && surface.contains(event.target)) {
        const fields = Array.from(surface.querySelectorAll(FOCUSABLE)).filter(
          (element) => element.getClientRects().length && element.tabIndex >= 0,
        );
        const first = fields[0];
        const last = fields[fields.length - 1];

        if (
          !fields.length ||
          (event.shiftKey &&
            (event.target === first || event.target === surface)) ||
          (!event.shiftKey && event.target === last)
        ) {
          event.preventDefault();
          (event.shiftKey ? last || surface : first || surface).focus({
            preventScroll: true,
          });
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      openDialogs.splice(openDialogs.indexOf(surface), 1);

      if (!openDialogs.length && !preserveBodyClass)
        document.body.classList.remove('Modal-open');
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, opener]);

  if (!open) return null;

  const variables = {
    '--fie-dialog-radius': shape.borderRadius.lg,
    '--fie-dialog-title-radius': shape.borderRadius.md,
    '--fie-dialog-background': palette['bg-secondary'],
    '--fie-dialog-shadow': palette['light-shadow'],
    '--fie-dialog-text': palette['txt-primary'],
    '--fie-dialog-icon-background': palette.accent_1_2_opacity,
    '--fie-dialog-icon-color': palette['accent-stateless'],
    '--fie-dialog-close-color': palette['icons-secondary'],
    '--fie-dialog-close-accent': palette['accent-primary'],
    '--fie-dialog-close-hover': palette['icon-primary'],
    '--fie-dialog-close-active': palette['icons-primary-hover'],
    '--fie-dialog-hover-background': palette['bg-hover'],
    '--fie-dialog-active-background': palette['bg-active'],
  };

  return createPortal(
    <div className={cx(styles.wrapper, 'SfxModal-Wrapper')} style={modalStyles}>
      <div
        className={cx(styles.overlay, 'SfxModal-Overlay')}
        aria-hidden="true"
        onClick={onClose}
      />
      <ThemeScope
        {...props}
        as={DialogView}
        ref={panel}
        style={{ ...variables, ...style }}
      >
        {children}
      </ThemeScope>
    </div>,
    document.body,
  );
};

Dialog.defaultProps = { open: false, modalStyles: undefined, style: undefined };
Dialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  modalStyles: PropTypes.instanceOf(Object),
  style: PropTypes.instanceOf(Object),
  children: PropTypes.node.isRequired,
};

export default Dialog;
