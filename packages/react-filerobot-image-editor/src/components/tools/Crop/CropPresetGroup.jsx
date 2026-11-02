import FieAccordion from 'ui/Accordion';
import useFieldId from 'hooks/useFieldId';
/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import toPrecisedFloat from 'utils/toPrecisedFloat';
import { useStore } from 'hooks';
import CropPresetItem from './CropPresetItem';

import CropStyles from './Crop.module.css';

const CropPresetGroup = ({
  groupTitleKey,
  items,
  onItemSelect,
  t,
  isExpanded,
  setExpandedGroup,
}) => {
  const {
    theme: { palette },
    adjustments: {
      crop: { ratio: currentRatio, ratioGroupKey, ratioTitleKey },
    },
  } = useStore();

  const id = useFieldId();

  const toggleExpand = () => {
    setExpandedGroup(isExpanded ? null : groupTitleKey);
  };

  const onItemSelectFromGroup = (e, newRatio, cropProps) => {
    onItemSelect(e, newRatio, {
      ...cropProps,
      ratioGroupKey: groupTitleKey,
    });
  };

  return (
    <FieAccordion
      id={id}
      style={{ '--fie-accordion-color': palette['link-primary'] }}
      label={t(groupTitleKey)}
      onChange={toggleExpand}
      expanded={isExpanded}
      className={CropStyles.accordion}
    >
      {items.map(
        ({
          titleKey,
          ratio,
          width,
          height,
          descriptionKey,
          icon,
          disableManualResize,
          noEffect,
        }) => {
          const newRatio = ratio ?? toPrecisedFloat(width / height);

          return (
            <CropPresetItem
              key={titleKey}
              titleKey={titleKey}
              t={t}
              description={t(descriptionKey)}
              size="sm"
              onClick={onItemSelectFromGroup}
              width={width}
              height={height}
              ratio={newRatio}
              Icon={icon}
              isAccordion
              disableManualResize={disableManualResize}
              isActive={
                currentRatio === newRatio &&
                ratioTitleKey === titleKey &&
                ratioGroupKey === groupTitleKey
              }
              noEffect={noEffect}
            />
          );
        },
      )}
    </FieAccordion>
  );
};

CropPresetGroup.propTypes = {
  groupTitleKey: PropTypes.string.isRequired,
  items: PropTypes.instanceOf(Array).isRequired,
  onItemSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  setExpandedGroup: PropTypes.func.isRequired,
};

export default CropPresetGroup;
