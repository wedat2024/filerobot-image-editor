import FieSmallButton from 'components/common/IconButton';
import FieZoomPercentageLabel from 'ui/TextButton';
/** External Dependencies */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { MinusOutline, PlusOutline } from '@scaleflex/icons';

/** Internal Dependencies */
import { ZOOM_CANVAS } from 'actions';
import { DEFAULT_ZOOM_FACTOR, TOOLS_IDS } from 'utils/constants';
import { useStore } from 'hooks';
import useFieldId from 'hooks/useFieldId';
import ActionMenu from 'components/common/ActionMenu';
import triggerKeyboard from 'components/common/ActionMenu/triggerKeyboard';
import getZoomFitFactor from 'utils/getZoomFitFactor';
import getLabelStyles from 'components/common/Label/getLabelStyles';
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
    theme: { typography, palette },
    shownImageDimensions,
    resize,
    originalImage,
    adjustments: { crop },
    config: { useZoomPresetsMenu },
  } = useStore();

  const isBlockerError = feedback.duration === 0;

  const [zoomingMenuAnchorEl, setZoomingMenuAnchorEl] = useState(null);

  const menuId = useFieldId();
  const [initialFocus, setInitialFocus] = useState('first');

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

  const closeZoomingMenu = () => setZoomingMenuAnchorEl(null);

  const toggleZoomingMenu = (event, focus = 'first') => {
    setInitialFocus(focus);
    setZoomingMenuAnchorEl(zoomingMenuAnchorEl ? null : event.currentTarget);
  };

  const applyZoomFactorPreset = (factor) => {
    if (factor === 'fit') {
      fitCanvas();
      closeZoomingMenu();

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
    closeZoomingMenu();
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
        style={getLabelStyles({
          font: typography.font['label-medium'],
          palette,
        })}
        id={`${menuId}-trigger`}
        title={t('toggleZoomMenuTitle')}
        disabled={isZoomDisabled}
        aria-haspopup={useZoomPresetsMenu ? 'menu' : undefined}
        aria-expanded={
          useZoomPresetsMenu ? Boolean(zoomingMenuAnchorEl) : undefined
        }
        aria-controls={zoomingMenuAnchorEl ? menuId : undefined}
        {...(useZoomPresetsMenu && !isZoomDisabled
          ? triggerKeyboard(toggleZoomingMenu)
          : {})}
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
      {zoomingMenuAnchorEl ? (
        <ActionMenu
          id={menuId}
          aria-labelledby={`${menuId}-trigger`}
          anchor={zoomingMenuAnchorEl}
          initialFocus={initialFocus}
          onClose={closeZoomingMenu}
          position="bottom"
          className="FIE_topbar-zoom-menu"
          items={ZOOM_FACTORS_PRESETS.map(({ factor, labelKey, label }) => ({
            key: label || labelKey,
            label: label ?? t(labelKey),
            onClick: () => applyZoomFactorPreset(factor),
          }))}
        />
      ) : (
        // Preserve the closed menu placeholder and the existing flex gap.
        <div aria-hidden="true" />
      )}
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
