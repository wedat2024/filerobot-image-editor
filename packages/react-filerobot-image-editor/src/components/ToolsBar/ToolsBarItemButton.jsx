/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve existing click behavior during CSS migration. */
import FieToolsBarItemButtonLabel from '@scaleflex/ui/core/label';
/** External Dependencies */
import React, { memo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { usePhoneScreen } from 'hooks';

import ToolsBarStyles from './ToolsBar.module.css';

const ToolsBarItemButton = ({
  id,
  label,
  onClick,
  Icon,
  isSelected,
  children,
  className,
}) => {
  const isPhoneScreen = usePhoneScreen(320);

  const handleClick = (e) => {
    onClick(id, e);
  };

  return (
    <div
      onClick={handleClick}
      aria-selected={isSelected}
      className={cx(
        ToolsBarStyles.toolsBarItemButton,
        isPhoneScreen && ToolsBarStyles.phone,
        className,
      )}
    >
      <Icon size={isPhoneScreen ? 20 : 16} />
      {label && (
        <FieToolsBarItemButtonLabel
          className={cx(
            ToolsBarStyles.toolsBarItemButtonLabel,
            isPhoneScreen && ToolsBarStyles.phone,
          )}
        >
          {label}
        </FieToolsBarItemButtonLabel>
      )}
      {children}
    </div>
  );
};

ToolsBarItemButton.defaultProps = {
  isSelected: false,
  id: undefined,
  children: null,
  label: '',
};

ToolsBarItemButton.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  Icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.instanceOf(Object),
  ]).isRequired,
};

export default memo(ToolsBarItemButton);
