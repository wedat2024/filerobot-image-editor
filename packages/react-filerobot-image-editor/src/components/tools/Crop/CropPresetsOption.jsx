import FieToolsBarItemButtonLabel from 'components/common/Label';
import FieOpenMenuButton from 'ui/PopupTrigger';
import useFieldId from 'hooks/useFieldId';
import ThemeScope from 'context/CssTheme';
/** External Dependencies */
import React, { useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { SET_CROP, SET_RESIZE, ZOOM_CANVAS } from 'actions';
import { usePhoneScreen, useStore } from 'hooks';

import ToolsBarStyles from 'components/ToolsBar/ToolsBar.module.css';

import { DEFAULT_ZOOM_FACTOR, ORIGINAL_CROP, TOOLS_IDS } from 'utils/constants';
import toPrecisedFloat from 'utils/toPrecisedFloat';
import getZoomFitFactor from 'utils/getZoomFitFactor';
import { MoveDownOutline, MoveUpOutline } from '@scaleflex/icons';
import Popover from 'components/common/Popover';
import { DEFAULT_CROP_PRESETS } from './Crop.constants';
import CropPresetGroupsList from './CropPresetGroupsFolder';
import CropPresetItem from './CropPresetItem';

import CropStyles from './Crop.module.css';

const CropPresetsOption = ({ anchorEl, onClose }) => {
  const {
    dispatch,
    t,
    theme: { palette, shape },
    adjustments: {
      crop: { ratio: appliedRatio, ratioTitleKey, ratioFolderKey } = {},
    } = {},
    shownImageDimensions,
    config,
  } = useStore();

  const popupId = useFieldId();

  const currentRatio = appliedRatio || ORIGINAL_CROP; // we consider original as default one if no ratio has been set.
  const cropConfig = config[TOOLS_IDS.CROP];

  const isPhoneScreen = usePhoneScreen();

  const allPresets = useMemo(() => {
    const {
      presetsItems = [],
      presetsFolders = [],
      lockCropAreaAt,
    } = cropConfig;
    const defaultPresets = lockCropAreaAt
      ? DEFAULT_CROP_PRESETS.filter((item) => !item.hide?.({ lockCropAreaAt }))
      : DEFAULT_CROP_PRESETS;

    return [...presetsFolders, ...defaultPresets, ...presetsItems];
  }, [cropConfig]);

  const changeCropRatio = (e, newCropRatio, cropProps) => {
    e.stopPropagation();

    const newCrop = {
      ratio: newCropRatio,
      ratioTitleKey: cropProps.ratioTitleKey,
      ratioGroupKey: cropProps.ratioGroupKey,
      ratioFolderKey: cropProps.ratioFolderKey,
      noEffect: cropProps.noEffect,
    };

    dispatch({
      type: SET_CROP,
      payload: newCrop,
    });

    if (cropConfig.autoResize) {
      dispatch({
        type: SET_RESIZE,
        payload: {
          width: cropProps.width,
          height: cropProps.height,
          manualChangeDisabled: cropProps.disableManualResize,
        },
      });
      dispatch({
        type: ZOOM_CANVAS,
        payload: {
          factor:
            cropProps.width > shownImageDimensions.width ||
            cropProps.height > shownImageDimensions.height
              ? getZoomFitFactor(shownImageDimensions, cropProps)
              : DEFAULT_ZOOM_FACTOR,
        },
      });
    }

    anchorEl?.querySelector('button')?.focus({ preventScroll: true });
    onClose();
  };

  const renderPreset = ({
    titleKey,
    descriptionKey,
    ratio,
    width,
    height,
    groups,
    icon: Icon,
    disableManualResize,
    noEffect,
  }) =>
    groups ? (
      <CropPresetGroupsList
        key={titleKey}
        titleKey={titleKey}
        groups={groups}
        Icon={Icon}
        onItemSelect={changeCropRatio}
        t={t}
        disableManualResize={disableManualResize}
      />
    ) : (
      <CropPresetItem
        key={ratio}
        ratio={ratio ?? toPrecisedFloat(width / height)}
        titleKey={titleKey}
        t={t}
        description={t(descriptionKey)}
        Icon={Icon}
        isActive={
          currentRatio === (ratio ?? toPrecisedFloat(width / height)) &&
          !ratioFolderKey
        }
        width={width}
        height={height}
        onClick={changeCropRatio}
        disableManualResize={disableManualResize}
        noEffect={noEffect}
      />
    );

  const toolTitleKey = ratioTitleKey || 'cropTool';

  return (
    <>
      <div className={CropStyles.toolsBarItemButtonWrapper}>
        <FieToolsBarItemButtonLabel
          className={cx(
            ToolsBarStyles.toolsBarItemButtonLabel,
            isPhoneScreen && ToolsBarStyles.phone,
            'FIE_crop-tool-label FIE_selected-crop-preset-label',
          )}
        >
          {t(toolTitleKey)}
        </FieToolsBarItemButtonLabel>
        <FieOpenMenuButton
          style={{
            '--fie-crop-opener-color': palette['link-stateless'],
            '--fie-crop-opener-hover': palette['accent-primary-hover'],
            '--fie-crop-opener-active': palette['accent-primary-active'],
            '--fie-crop-opener-radius': shape.borderRadius.md,
          }}
          id={`${popupId}-trigger`}
          aria-label={t('cropTool')}
          aria-haspopup="dialog"
          aria-expanded={Boolean(anchorEl)}
          aria-controls={anchorEl ? popupId : undefined}
          className={cx(
            CropStyles.openMenuButton,
            'FIE_crop-presets-opener-button',
          )}
        >
          {anchorEl ? (
            <MoveUpOutline size={10} />
          ) : (
            <MoveDownOutline size={10} />
          )}
        </FieOpenMenuButton>
      </div>

      {anchorEl ? (
        <Popover
          id={popupId}
          aria-labelledby={`${popupId}-trigger`}
          className="FIE_crop-presets-menu"
          anchor={anchorEl}
          onClose={onClose}
          position="top"
          offset={4}
          style={{ maxHeight: '100%' }}
        >
          <ThemeScope as="div" className={CropStyles.menu}>
            {allPresets.map(renderPreset)}
          </ThemeScope>
        </Popover>
      ) : (
        <div aria-hidden="true" />
      )}
    </>
  );
};

CropPresetsOption.defaultProps = {
  anchorEl: null,
};

CropPresetsOption.propTypes = {
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.instanceOf(HTMLElement),
};

export default CropPresetsOption;
