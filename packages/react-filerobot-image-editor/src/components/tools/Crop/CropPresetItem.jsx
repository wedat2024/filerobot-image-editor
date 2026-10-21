import Label from '@scaleflex/ui/core/label';

import { MenuItem as FieMenuItem } from '@scaleflex/ui/core';
/** External Dependeices */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependeices */
import CropStyles from './Crop.module.css';

const CropPresetItem = ({
  titleKey,
  description,
  ratio,
  onClick,
  Icon,
  isActive,
  isAccordion,
  width,
  height,
  t,
  disableManualResize,
  noEffect,
}) => {
  const handleOnClick = (e) =>
    onClick(e, ratio, {
      ratioTitleKey: titleKey,
      width,
      height,
      disableManualResize,
      noEffect,
    });

  return (
    <FieMenuItem
      active={isActive}
      onClick={handleOnClick}
      className={cx(
        CropStyles.menuItem,
        isAccordion && CropStyles.accordionItem,
      )}
    >
      {Icon && (
        <div className={CropStyles.menuItemIcon}>
          {typeof Icon === 'string' ? (
            // eslint-disable-next-line react/no-danger
            <span dangerouslySetInnerHTML={{ __html: Icon }} />
          ) : (
            <Icon color="var(--fie-icon-primary)" />
          )}
        </div>
      )}

      <Label className={CropStyles.menuItemLabel}>{t(titleKey)}</Label>

      {description && (
        <Label className={CropStyles.ratioDescription}>{description}</Label>
      )}
    </FieMenuItem>
  );
};

CropPresetItem.defaultProps = {
  Icon: undefined,
  width: undefined,
  height: undefined,
  disableManualResize: false,
  isAccordion: false,
  noEffect: false,
};

CropPresetItem.propTypes = {
  titleKey: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  disableManualResize: PropTypes.bool,
  isAccordion: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  Icon: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.string,
    PropTypes.instanceOf(HTMLElement),
  ]),
  noEffect: PropTypes.bool,
};

export default CropPresetItem;
