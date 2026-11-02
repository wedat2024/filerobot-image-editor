import PopupTrigger from 'ui/PopupTrigger';
import useFieldId from 'hooks/useFieldId';
import ThemeScope from 'context/CssTheme';
/** External Dependencies */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Popover from 'components/common/Popover';
import Padding from '@scaleflex/icons/padding';

/** Internal Dependencies */
import restrictNumber from 'utils/restrictNumber';

import AnnotationOptionsStyles from 'components/common/AnnotationOptions/AnnotationOptions.module.css';

import Slider from 'components/common/Slider';
import Label from 'components/common/Label';

const WatermarkPadding = ({ watermark, saveWatermark, t }) => {
  const popupId = useFieldId();
  const [anchorEl, setAnchorEl] = useState(null);

  const openOptionPopup = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeOptionPopup = () => {
    setAnchorEl(null);
  };

  const updatePadding = (newPadding) => {
    saveWatermark({ padding: restrictNumber(newPadding, 0, 100) });
  };

  const currentPadding = watermark.padding || 0;

  return (
    <>
      <PopupTrigger
        id={`${popupId}-trigger`}
        aria-label={t('padding')}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchorEl)}
        aria-controls={anchorEl ? popupId : undefined}
        title={t('padding')}
        onClick={openOptionPopup}
        className={cx(
          AnnotationOptionsStyles.iconWrapper,
          anchorEl && AnnotationOptionsStyles.active,
          'FIE_watermark-padding-triggerer',
        )}
      >
        <Padding size={20} />
      </PopupTrigger>
      {anchorEl ? (
        <Popover
          id={popupId}
          aria-labelledby={`${popupId}-trigger`}
          className="FIE_watermark-padding-popup"
          anchor={anchorEl}
          onClose={closeOptionPopup}
          position="top"
        >
          <ThemeScope
            as="div"
            className={AnnotationOptionsStyles.optionPopupContent}
          >
            <Label>{t('padding')}</Label>
            <div className={AnnotationOptionsStyles.spacedOptionFields}>
              <Slider
                aria-label={t('padding')}
                annotation="px"
                onChange={updatePadding}
                value={currentPadding}
                noMargin
              />
              <Label
                className={AnnotationOptionsStyles.iconLabel}
              >{`${currentPadding}px`}</Label>
            </div>
          </ThemeScope>
        </Popover>
      ) : (
        <div aria-hidden="true" />
      )}
    </>
  );
};

WatermarkPadding.propTypes = {
  watermark: PropTypes.instanceOf(Object).isRequired,
  saveWatermark: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default WatermarkPadding;
