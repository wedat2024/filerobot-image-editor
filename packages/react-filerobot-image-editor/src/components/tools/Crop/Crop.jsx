import FieToolsBarItemButtonLabel from '@scaleflex/ui/core/label';
/** External Dependencies */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Crop as CropIcon } from '@scaleflex/icons/crop';

/** Internal Dependencies */
import { useStore } from 'hooks';
import ToolsBarItemButton from 'components/ToolsBar/ToolsBarItemButton';
import { TOOLS_IDS } from 'utils/constants';

import ToolsBarStyles from 'components/ToolsBar/ToolsBar.module.css';

import CropPresetsOption from './CropPresetsOption';

const Crop = ({ selectTool, isSelected }) => {
  const { config, t } = useStore();

  const [anchorEl, setAnchorEl] = useState();

  const selectToolAndShowPresets = (toolId, e) => {
    selectTool(toolId);
    setAnchorEl(e.currentTarget);
  };

  const closeCropPresets = () => {
    setAnchorEl(null);
  };

  return (
    <ToolsBarItemButton
      className="FIE_crop-tool"
      id={TOOLS_IDS.CROP}
      Icon={CropIcon}
      onClick={selectToolAndShowPresets}
      isSelected={isSelected}
    >
      {!config[TOOLS_IDS.CROP].noPresets ? (
        <CropPresetsOption anchorEl={anchorEl} onClose={closeCropPresets} />
      ) : (
        <FieToolsBarItemButtonLabel
          className={cx(
            ToolsBarStyles.toolsBarItemButtonLabel,
            'FIE_crop-tool-label',
          )}
        >
          {t('cropTool')}
        </FieToolsBarItemButtonLabel>
      )}
    </ToolsBarItemButton>
  );
};

Crop.defaultProps = {
  isSelected: false,
};

Crop.propTypes = {
  selectTool: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default Crop;
