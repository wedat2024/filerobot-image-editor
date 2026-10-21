import { MenuItem as FieMenuItem } from '@scaleflex/ui/core';
/** External Dependencies */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';

import themeStyles from 'context/Theme.module.css';

import CropPresetGroup from './CropPresetGroup';

import CropStyles from './Crop.module.css';

const CropPresetGroupsFolder = ({
  titleKey,
  Icon,
  groups,
  onItemSelect,
  t,
}) => {
  const {
    themeVariables,
    adjustments: {
      crop: { ratioFolderKey, ratioGroupKey },
    },
  } = useStore();

  const [expandedGroup, setExpandedGroup] = useState('');

  const onItemSelectFromFolder = (e, newRatio, cropProps) => {
    onItemSelect(e, newRatio, {
      ...cropProps,
      ratioFolderKey: titleKey,
    });
  };

  return (
    <FieMenuItem
      list={[
        {
          content: t(titleKey),
          key: titleKey,
          active: titleKey === ratioFolderKey,
          prefix: Icon && (
            <div className={CropStyles.menuItemIcon}>
              {typeof Icon === 'string' ? ( // eslint-disable-next-line react/no-danger
                <span dangerouslySetInnerHTML={{ __html: Icon }} />
              ) : (
                <Icon color="var(--fie-icon-primary)" />
              )}
            </div>
          ),
          subList: groups.map(({ titleKey: groupTitleKey, items }) => ({
            content: (
              <CropPresetGroup
                groupTitleKey={groupTitleKey}
                setExpandedGroup={setExpandedGroup}
                isExpanded={
                  expandedGroup === ''
                    ? ratioGroupKey === groupTitleKey
                    : expandedGroup === groupTitleKey
                }
                t={t}
                items={items}
                onItemSelect={onItemSelectFromFolder}
              />
            ),
            key: groupTitleKey,
            disableHover: true,
          })),
          subMenuProps: {
            className: themeStyles.scope,
            style: {
              ...themeVariables,
              backgroundColor: 'var(--fie-bg-stateless)',
            },
          },
        },
      ]}
      className={cx(CropStyles.menuItem, CropStyles.listItem)}
    />
  );
};

CropPresetGroupsFolder.defaultProps = {
  Icon: undefined,
};

CropPresetGroupsFolder.propTypes = {
  titleKey: PropTypes.string.isRequired,
  groups: PropTypes.instanceOf(Array).isRequired,
  onItemSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  Icon: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.string,
    PropTypes.instanceOf(HTMLElement),
  ]),
};

export default CropPresetGroupsFolder;
