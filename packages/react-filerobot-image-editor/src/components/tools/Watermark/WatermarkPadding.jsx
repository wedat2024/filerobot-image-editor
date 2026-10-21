/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve existing click behavior during CSS migration. */
import FieIconLabel from '@scaleflex/ui/core/label';
import ThemeScope from 'context/CssTheme';
/** External Dependencies */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Menu from '@scaleflex/ui/core/menu';
import Padding from '@scaleflex/icons/padding';

/** Internal Dependencies */
import restrictNumber from 'utils/restrictNumber';

import AnnotationOptionsStyles from 'components/common/AnnotationOptions/AnnotationOptions.module.css';

import Slider from 'components/common/Slider';
import { Label } from '@scaleflex/ui/core';

const WatermarkPadding = ({ watermark, saveWatermark, t }) => {
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
      <div
        title={t('padding')}
        onClick={openOptionPopup}
        className={cx(
          AnnotationOptionsStyles.iconWrapper,
          anchorEl && AnnotationOptionsStyles.active,
          'FIE_watermark-padding-triggerer',
        )}
      >
        <Padding size={20} />
      </div>
      <Menu
        className="FIE_watermark-padding-popup"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
              annotation="px"
              onChange={updatePadding}
              value={currentPadding}
              noMargin
            />
            <FieIconLabel
              className={AnnotationOptionsStyles.iconLabel}
            >{`${currentPadding}px`}</FieIconLabel>
          </div>
        </ThemeScope>
      </Menu>
    </>
  );
};

WatermarkPadding.propTypes = {
  watermark: PropTypes.instanceOf(Object).isRequired,
  saveWatermark: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default WatermarkPadding;
