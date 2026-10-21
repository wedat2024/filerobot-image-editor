/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve existing click behavior during CSS migration. */
import FieTabItemLabel from '@scaleflex/ui/core/label';
/** External Dependencies */
import React, { useCallback, memo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import TabsStyles from './Tabs.module.css';

const TabItem = ({ id, label, Icon, isSelected, onClick }) => {
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick(id);
    }
  }, [id]);

  return (
    <div
      aria-selected={isSelected}
      onClick={handleClick}
      className={cx(TabsStyles.tabItem, 'FIE_tab')}
    >
      <Icon size={24} />
      {label && (
        <FieTabItemLabel
          className={cx(TabsStyles.tabItemLabel, 'FIE_tab-label')}
        >
          {label}
        </FieTabItemLabel>
      )}
    </div>
  );
};

TabItem.defaultProps = {
  isSelected: false,
  onClick: undefined,
  label: undefined,
};

TabItem.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  Icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.instanceOf(Object),
  ]).isRequired,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

export default memo(TabItem);
