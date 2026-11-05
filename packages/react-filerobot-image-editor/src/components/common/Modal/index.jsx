/** External Dependencies */
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import useFieldId from 'hooks/useFieldId';
import Button from 'components/common/Button';
import Dialog from 'components/common/Dialog';
import { DialogTitle, DialogContent, DialogActions } from 'ui/Dialog';
import ModalStyles from './Modal.module.css';

const Modal = ({
  title,
  hint = '',
  Icon,
  onDone,
  onCancel,
  doneLabel = 'Yes',
  cancelLabel = 'No',
  isOpened = false,
  doneButtonStyle,
  doneButtonColor = 'basic',
  cancelButtonColor = 'basic',
  children,
  areButtonsDisabled = false,
  zIndex,
  className,
  width = '',
  isWarning = false,
}) => {
  const { t } = useStore();
  const titleId = useFieldId();
  const descriptionId = useFieldId();

  const onKeyUp = (e) => {
    if (
      e.key === 'Enter' &&
      !e.defaultPrevented &&
      !areButtonsDisabled &&
      !e.target.closest('button')
    ) {
      onDone(e);
    }
  };

  return (
    <Dialog
      aria-labelledby={titleId}
      aria-describedby={hint ? descriptionId : undefined}
      open={isOpened}
      onClose={onCancel}
      onKeyUp={onKeyUp}
      style={{ '--fie-modal-width': width || '300px', zIndex }}
      className={cx(ModalStyles.modal, className)}
    >
      <DialogTitle
        id={titleId}
        descriptionId={descriptionId}
        closeLabel={t('close')}
        icon={<Icon size={25} />}
        onClose={onCancel}
        primary={title}
        secondary={hint}
        className={cx(ModalStyles.modalTitle, isWarning && ModalStyles.warning)}
      />
      {children && <DialogContent>{children}</DialogContent>}
      <DialogActions className={ModalStyles.modalActions}>
        <Button
          data-dialog-initial-focus
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
          style={doneButtonStyle}
          disabled={areButtonsDisabled}
        >
          {doneLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
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
