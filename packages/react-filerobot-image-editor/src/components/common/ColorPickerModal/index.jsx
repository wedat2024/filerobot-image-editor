import ColorPicker from 'components/common/ColorPicker';
import cx from 'classnames';
import PT from 'prop-types';

import ColorPickerIcon from '@scaleflex/icons/color-picker';

import { useStore } from 'hooks';
import Button from 'components/common/Button';
import Dialog from 'components/common/Dialog';
import { DialogTitle, DialogContent, DialogActions } from 'ui/Dialog';
import useFieldId from 'hooks/useFieldId';

import ColorPickerModalStyles from './ColorPickerModal.module.css';

const modalStyles = { zIndex: 1301 };

const defaultPinnedColors = [];
const defaultOnChange = () => {};
const defaultOnClose = () => {};

const ColorPickerModal = ({
  hideModalTitle = false,
  defaultColor = '',
  onChange = defaultOnChange,
  open = false,
  pinnedColors = defaultPinnedColors,
  onClose = defaultOnClose,
}) => {
  const { t } = useStore();
  const titleId = useFieldId();
  const title = t('colorPickerModalTitleLabel', 'Pick color');

  if (!open) {
    return null;
  }

  return (
    <Dialog
      aria-labelledby={hideModalTitle ? undefined : titleId}
      aria-label={hideModalTitle ? title : undefined}
      onClose={onClose}
      open={open}
      fullWidth
      modalStyles={modalStyles}
      className={ColorPickerModalStyles.colorPickerModal}
    >
      {!hideModalTitle && (
        <DialogTitle
          id={titleId}
          closeLabel={t('close')}
          onClose={onClose}
          primary={title}
          icon={<ColorPickerIcon size={29} />}
        />
      )}

      <DialogContent>
        <div
          className={cx(
            ColorPickerModalStyles.colorPickerWrap,
            hideModalTitle && ColorPickerModalStyles.withoutTitle,
          )}
        >
          <ColorPicker
            onChange={onChange}
            pinnedColors={pinnedColors}
            defaultColor={defaultColor}
          />
        </div>
      </DialogContent>

      <DialogActions className={ColorPickerModalStyles.modalActions}>
        <Button
          color="basic"
          size="md"
          data-dialog-initial-focus
          onClick={onClose}
        >
          {t('cancel')}
        </Button>
        <Button size="md" onClick={onClose}>
          {t('apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ColorPickerModal.propTypes = {
  defaultColor: PT.string,
  onChange: PT.func,
  open: PT.bool,
  hideModalTitle: PT.bool,
  pinnedColors: PT.arrayOf(PT.string),
  onClose: PT.func,
};

export default ColorPickerModal;
