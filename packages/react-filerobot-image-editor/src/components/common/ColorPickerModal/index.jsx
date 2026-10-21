import {
  Modal as FieColorPickerModal,
  ModalActions as FieModalActions,
  Button,
  ColorPicker,
  ModalContent,
  ModalTitle,
} from '@scaleflex/ui/core';

import ThemeScope from 'context/CssTheme';
import React from 'react';
import cx from 'classnames';
import PT from 'prop-types';

import ColorPickerIcon from '@scaleflex/icons/color-picker';

import { useStore } from 'hooks';
import ColorPickerModalStyles from './ColorPickerModal.module.css';

const modalStyles = { zIndex: 1301 };

const ColorPickerModal = ({
  hideModalTitle,
  defaultColor = '',
  onChange,
  open,
  pinnedColors,
  onClose,
}) => {
  const { t } = useStore();

  if (!open) {
    return null;
  }

  return (
    <ThemeScope
      as={FieColorPickerModal}
      onClose={onClose}
      open={open}
      fullWidth
      modalStyles={modalStyles}
      className={ColorPickerModalStyles.colorPickerModal}
    >
      {!hideModalTitle && (
        <ModalTitle
          onClose={onClose}
          primary={t('colorPickerModalTitleLabel', 'Pick color')}
          icon={<ColorPickerIcon size={29} />}
          iconShadow
          variant="with-icon"
        />
      )}

      <ModalContent>
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
            showTransparentColor
          />
        </div>
      </ModalContent>

      <FieModalActions className={ColorPickerModalStyles.modalActions}>
        <Button color="basic" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button color="primary" onClick={onClose}>
          {t('apply')}
        </Button>
      </FieModalActions>
    </ThemeScope>
  );
};

ColorPickerModal.defaultProps = {
  defaultColor: '',
  pinnedColors: [],
  onChange: () => {},
  open: false,
  hideModalTitle: false,
  onClose: () => {},
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
