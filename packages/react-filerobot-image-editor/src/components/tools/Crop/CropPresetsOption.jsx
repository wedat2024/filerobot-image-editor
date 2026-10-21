import FieToolsBarItemButtonLabel from '@scaleflex/ui/core/label';
import FieOpenMenuButton from '@scaleflex/ui/core/button';
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
import { Menu } from '@scaleflex/ui/core';
import { DEFAULT_CROP_PRESETS } from './Crop.constants';
import CropPresetGroupsList from './CropPresetGroupsFolder';
import CropPresetItem from './CropPresetItem';
import CropStyles from './Crop.module.css';

const CropPresetsOption = ({ anchorEl, onClose }) => {
  const {
    dispatch,
    t,
    adjustments: {
      crop: { ratio: appliedRatio, ratioTitleKey, ratioFolderKey } = {},
    } = {},
    shownImageDimensions,
    config,
  } = useStore();
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
          color="link-secondary"
          size="lg"
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

      <Menu
        className="FIE_crop-presets-menu"
        anchorEl={anchorEl}
        enableOverlay
        onClose={onClose}
        open={Boolean(anchorEl)}
        position="top"
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 4],
              },
            },
          ],
        }}
        maxHeight="100%"
      >
        <ThemeScope as="div" className={CropStyles.menu}>
          {allPresets.map(renderPreset)}
        </ThemeScope>
      </Menu>
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
