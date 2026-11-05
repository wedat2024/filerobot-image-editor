import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import CrossOutline from '@scaleflex/icons/cross-outline';

import styles from './Dialog.module.css';

const Dialog = forwardRef(
  ({ children, className, fullWidth = false, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className={cx(
        styles.container,
        fullWidth && styles.fullWidth,
        'SfxModal-Container',
        className,
      )}
    >
      <div className={cx(styles.body, 'SfxModal-root')}>{children}</div>
    </div>
  ),
);

Dialog.displayName = 'Dialog';
Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export const DialogTitle = ({
  primary,
  secondary,
  icon,
  onClose,
  closeLabel,
  className,
  id,
  descriptionId,
}) => (
  <div className={cx(styles.title, 'SfxModalTitle-root', className)}>
    {icon && (
      <div aria-hidden="true" className={cx(styles.icon, 'SfxModalTitle-Icon')}>
        {icon}
      </div>
    )}
    <div id={id} className={cx(styles.primary, 'SfxModalTitle-LabelPrimary')}>
      {primary}
    </div>
    {secondary && (
      <div
        id={descriptionId}
        className={cx(styles.secondary, 'SfxModalTitle-LabelSecondary')}
      >
        {secondary}
      </div>
    )}
    <div className={cx(styles.close, 'SfxModalTitle-Close')}>
      <button
        type="button"
        className={cx(styles.closeButton, 'SfxCrossButton-root')}
        aria-label={closeLabel}
        onClick={onClose}
      >
        <CrossOutline size={16} />
      </button>
    </div>
  </div>
);

DialogTitle.propTypes = {
  primary: PropTypes.node.isRequired,
  secondary: PropTypes.node,
  icon: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  closeLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  descriptionId: PropTypes.string,
};

export const DialogContent = ({ children }) => (
  <div className={cx(styles.content, 'SfxModalContent-root')}>{children}</div>
);

DialogContent.propTypes = { children: PropTypes.node.isRequired };

export const DialogActions = ({ children, className }) => (
  <div className={cx(styles.actions, 'SfxModalActions-root', className)}>
    {children}
  </div>
);

DialogActions.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Dialog;
