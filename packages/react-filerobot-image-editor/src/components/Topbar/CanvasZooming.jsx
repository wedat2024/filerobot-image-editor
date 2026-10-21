import FieSmallButton from '@scaleflex/ui/core/icon-button';
import FieZoomPercentageLabel from '@scaleflex/ui/core/label';
/** External Dependencies */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { MinusOutline, PlusOutline } from '@scaleflex/icons';
import Menu from '@scaleflex/ui/core/menu';
import MenuItem, { MenuItemLabel } from '@scaleflex/ui/core/menu-item';

/** Internal Dependencies */
import { ZOOM_CANVAS } from 'actions';
import { DEFAULT_ZOOM_FACTOR, TOOLS_IDS } from 'utils/constants';
import { useStore } from 'hooks';
import getZoomFitFactor from 'utils/getZoomFitFactor';
import toPrecisedFloat from 'utils/toPrecisedFloat';

import TopbarStyles from './Topbar.module.css';

import { ZOOM_FACTORS_PRESETS } from './Topbar.constants';

const MULTIPLY_ZOOM_FACTOR = 1.1;

const CanvasZooming = ({ showBackButton }) => {
  const {
    dispatch,
    zoom = {},
    toolId,
    feedback,
    t,
    shownImageDimensions,
    resize,
    originalImage,
    adjustments: { crop },
    config: { useZoomPresetsMenu },
  } = useStore();

  const isBlockerError = feedback.duration === 0;

  const [zoomingMenuAnchorEl, setZoomingMenuAnchorEl] = useState(null);

  const saveZoom = (zoomFactor, isAbsoluteZoom) => {
    dispatch({
      type: ZOOM_CANVAS,
      payload: {
        factor: zoomFactor,
        isAbsoluteZoom,
      },
    });
  };

  const zoomIn = () => {
    saveZoom(zoom.factor * MULTIPLY_ZOOM_FACTOR);
  };

  const fitCanvas = () => {
    const usedAsOrgDimens =
      (resize.width && resize.height && resize) ||
      (crop.width && crop.height && crop) ||
      shownImageDimensions;
    const fitCanvasFactor = getZoomFitFactor(
      (crop.width && crop.height && crop) || shownImageDimensions,
      usedAsOrgDimens,
    );

    saveZoom(fitCanvasFactor || DEFAULT_ZOOM_FACTOR, true);
  };

  const zoomOut = () => {
    saveZoom(zoom.factor / MULTIPLY_ZOOM_FACTOR);
  };

  const toggleZoomingMenu = (event) => {
    setZoomingMenuAnchorEl(zoomingMenuAnchorEl ? null : event.target);
  };

  const applyZoomFactorPreset = (factor) => {
    if (factor === 'fit') {
      fitCanvas();
      toggleZoomingMenu();

      return;
    }

    const factorToAchieveSelected =
      resize.width || resize.height
        ? factor
        : Math.min(
            (factor * originalImage.width) / shownImageDimensions.width,
            (factor * originalImage.height) / shownImageDimensions.height,
          );

    saveZoom(factorToAchieveSelected, true);
    toggleZoomingMenu();
  };

  const isZoomDisabled = toolId === TOOLS_IDS.CROP || isBlockerError;
  const previewToRealImgFactor =
    originalImage && !resize.width && !resize.height
      ? Math.min(
          (shownImageDimensions.width * zoom.factor) / originalImage.width,
          (shownImageDimensions.height * zoom.factor) / originalImage.height,
        )
      : zoom.factor;

  return (
    <div className={TopbarStyles.zoomingWrapper}>
      <FieSmallButton
        onClick={zoomOut}
        color="basic"
        title={t('zoomOutTitle')}
        disabled={isZoomDisabled}
        className={cx(
          TopbarStyles.smallButton,
          showBackButton && TopbarStyles.backButton,
          'FIE_topbar-zoom-out-btn',
        )}
      >
        <MinusOutline />
      </FieSmallButton>
      <FieZoomPercentageLabel
        title={t('toggleZoomMenuTitle')}
        onClick={
          isZoomDisabled
            ? undefined
            : (useZoomPresetsMenu && toggleZoomingMenu) || fitCanvas
        }
        aria-disabled={isZoomDisabled}
        className={cx(
          TopbarStyles.zoomPercentageLabel,
          'FIE_topbar-zoom-label',
        )}
      >
        {`${toPrecisedFloat(previewToRealImgFactor * 100, 0)}%`}
      </FieZoomPercentageLabel>
      <FieSmallButton
        onClick={zoomIn}
        color="basic"
        title={t('zoomInTitle')}
        disabled={isZoomDisabled}
        className={cx(
          TopbarStyles.smallButton,
          showBackButton && TopbarStyles.backButton,
          'FIE_topbar-zoom-in-btn',
        )}
      >
        <PlusOutline />
      </FieSmallButton>
      <Menu
        anchorEl={zoomingMenuAnchorEl}
        onClose={toggleZoomingMenu}
        open={Boolean(zoomingMenuAnchorEl)}
        position="bottom"
        className="FIE_topbar-zoom-menu"
      >
        {ZOOM_FACTORS_PRESETS.map(({ factor, labelKey, label }) => (
          <MenuItem
            key={label || labelKey}
            onClick={() => applyZoomFactorPreset(factor)}
          >
            <MenuItemLabel>{label ?? t(labelKey)}</MenuItemLabel>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

CanvasZooming.defaultProps = {
  showBackButton: false,
};

CanvasZooming.propTypes = {
  showBackButton: PropTypes.bool,
};

export default CanvasZooming;
