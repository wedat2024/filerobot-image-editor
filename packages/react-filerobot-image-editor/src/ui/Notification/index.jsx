import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import CrossOutline from '@scaleflex/icons/cross-outline';

import styles from './Notification.module.css';

const Notification = ({
  message,
  labelStyle,
  icon,
  closeLabel,
  onClose,
  className,
  ...props
}) => (
  <div {...props} className={cx(styles.position, 'SfxPopup-root', className)}>
    <div className={cx(styles.card, 'SfxPopupContent-PopupContent', className)}>
      <span
        className={cx(styles.status, 'SfxPopupContent-PopupStatus')}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className={cx(styles.labelWrapper, 'SfxPopupContent-LabelWrapper')}>
        <span
          role="alert"
          style={labelStyle}
          className={cx(styles.label, 'SfxPopupContent-Label')}
        >
          {message}
        </span>
      </span>
      <div className={styles.closeWrapper}>
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className={cx(styles.close, 'SfxCrossButton-root')}
        >
          <CrossOutline size={12} />
        </button>
      </div>
    </div>
  </div>
);

Notification.defaultProps = { className: undefined, labelStyle: undefined };
Notification.propTypes = {
  message: PropTypes.node.isRequired,
  labelStyle: PropTypes.instanceOf(Object),
  icon: PropTypes.node.isRequired,
  closeLabel: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Notification;
