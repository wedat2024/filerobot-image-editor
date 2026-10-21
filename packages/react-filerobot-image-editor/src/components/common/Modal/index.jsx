import {
  Modal as FieModal,
  ModalActions as FieModalActions,
  Button,
  ModalContent,
} from '@scaleflex/ui/core';
import FieModalTitle from '@scaleflex/ui/core/modal-title';

import ThemeScope from 'context/CssTheme';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import ModalStyles from './Modal.module.css';

const Modal = ({
  title,
  hint,
  Icon,
  onDone,
  onCancel,
  doneLabel,
  cancelLabel,
  isOpened,
  doneButtonStyle,
  doneButtonColor = 'basic',
  cancelButtonColor = 'basic',
  children,
  areButtonsDisabled,
  zIndex,
  className,
  width,
  isWarning,
}) => {
  const onKeyUp = (e) => {
    if (e.key === 'Enter') {
      onDone(e);
    }
  };

  return (
    <ThemeScope
      as={FieModal}
      open={isOpened}
      onClose={onCancel}
      onKeyUp={onKeyUp}
      style={{ '--fie-modal-width': width || '300px', zIndex }}
      className={cx(ModalStyles.modal, className)}
    >
      <FieModalTitle
        icon={<Icon size={25} />}
        iconShadow
        onClose={onCancel}
        primary={title}
        secondary={hint}
        variant="with-icon"
        className={cx(ModalStyles.modalTitle, isWarning && ModalStyles.warning)}
      />
      {children && <ModalContent>{children}</ModalContent>}
      <FieModalActions align="center" className={ModalStyles.modalActions}>
        <Button
          color={cancelButtonColor}
          onClick={onCancel}
          size="md"
          disabled={areButtonsDisabled}
        >
          {cancelLabel}
        </Button>
        <Button
          color={doneButtonColor}
          onClick={onDone}
          size="md"
          warning={isWarning}
          style={doneButtonStyle}
          disabled={areButtonsDisabled}
        >
          {doneLabel}
        </Button>
      </FieModalActions>
    </ThemeScope>
  );
};

Modal.defaultProps = {
  hint: '',
  isOpened: false,
  doneLabel: 'Yes',
  cancelLabel: 'No',
  doneButtonStyle: undefined,
  doneButtonColor: 'basic',
  cancelButtonColor: 'basic',
  children: undefined,
  areButtonsDisabled: false,
  zIndex: undefined,
  className: undefined,
  width: '',
  isWarning: false,
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.instanceOf(Object).isRequired,
  onDone: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  hint: PropTypes.string,
  isOpened: PropTypes.bool,
  doneLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  doneButtonStyle: PropTypes.instanceOf(Object),
  doneButtonColor: PropTypes.string,
  cancelButtonColor: PropTypes.string,
  children: PropTypes.node,
  areButtonsDisabled: PropTypes.bool,
  zIndex: PropTypes.number,
  className: PropTypes.string,
  width: PropTypes.string,
  isWarning: PropTypes.bool,
};

export default Modal;
