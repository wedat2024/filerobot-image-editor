import FieMainButton from '@scaleflex/ui/core/button';
import {
  Menu as FieMenu,
  MenuItem as FieMenuItem,
  MenuItemIcon as FieMenuIcon,
} from '@scaleflex/ui/core';

import ThemeScope from 'context/CssTheme';
/** External Dependencies */
import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { MenuItemLabel } from '@scaleflex/ui/core/menu-item';

/** Internal Dependencies */
import { useStore } from 'hooks';
import ButtonWithMenuStyles from './ButtonWithMenu.module.css';

const ButtonWithMenu = ({
  onClick,
  title,
  label,
  color,
  menuFromBtn,
  menuItems,
  menuPosition = 'bottom',
  disabled = false,
  className,
  menuStyle,
  wrapperStyle,
  buttonRef,
  noMargin,
}) => {
  const { t } = useStore();
  const isMounted = useRef(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const buttonSize = 'sm';

  const filteredMenuItems = menuItems.filter(Boolean);
  const hasMultipleMenuItems = filteredMenuItems.length > 1;

  const openMenu = (e) => {
    if (isMounted.current) {
      setAnchorEl(e.currentTarget);
    }
  };

  const closeMenu = () => {
    if (isMounted.current) {
      setAnchorEl(null);
    }
  };

  const handleMenuItemClick = (onItemClick) => {
    if (typeof onItemClick === 'function') {
      onItemClick();
    }

    closeMenu();
  };

  const handleButtonClick = (e) => {
    if (menuFromBtn && hasMultipleMenuItems) {
      openMenu(e);
      return;
    }

    if (typeof onClick === 'function' && !filteredMenuItems[0]?.onClick) {
      onClick();
    } else if (filteredMenuItems[0]?.onClick) {
      filteredMenuItems[0].onClick();
    }
  };

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <>
      <div
        style={wrapperStyle}
        ref={buttonRef}
        className={cx(
          ButtonWithMenuStyles.buttonWrapper,
          noMargin && ButtonWithMenuStyles.noMargin,
          `${className}-wrapper`,
        )}
      >
        <FieMainButton
          color={color}
          size={buttonSize}
          title={title}
          onClick={disabled ? undefined : handleButtonClick}
          disabled={disabled}
          className={cx(ButtonWithMenuStyles.mainButton, `${className}-button`)}
        >
          {label || t('saveAs')}
        </FieMainButton>
      </div>
      {hasMultipleMenuItems && (
        <ThemeScope
          as={FieMenu}
          anchorEl={anchorEl}
          onClose={closeMenu}
          open
          style={menuStyle}
          position={menuPosition}
          className={cx(ButtonWithMenuStyles.menu, `${className}-menu`)}
        >
          {menuItems.map(
            (item, index) =>
              item && (
                <FieMenuItem
                  key={`${item.key}-${index.toString()}`}
                  active={item.isActive}
                  onClick={() => handleMenuItemClick(item.onClick)}
                  size={buttonSize}
                  className={cx(
                    ButtonWithMenuStyles.menuItem,
                    `${className}-menu-item`,
                  )}
                >
                  {item.icon && (
                    <FieMenuIcon
                      size={buttonSize}
                      className={ButtonWithMenuStyles.menuIcon}
                    >
                      {typeof item.icon === 'string' ? (
                        // eslint-disable-next-line react/no-danger
                        <span dangerouslySetInnerHTML={{ __html: item.icon }} />
                      ) : (
                        <item.icon />
                      )}
                    </FieMenuIcon>
                  )}
                  <MenuItemLabel>{item.label}</MenuItemLabel>
                </FieMenuItem>
              ),
          )}
        </ThemeScope>
      )}
    </>
  );
};

ButtonWithMenu.defaultProps = {
  title: '',
  label: '',
  color: 'primary',
  menuFromBtn: false,
  noMargin: false,
  menuPosition: 'bottom',
  onClick: undefined,
  disabled: false,
  menuStyle: undefined,
  wrapperStyle: undefined,
  buttonRef: undefined,
};

ButtonWithMenu.propTypes = {
  menuItems: PropTypes.instanceOf(Array).isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  menuFromBtn: PropTypes.bool,
  noMargin: PropTypes.bool,
  menuPosition: PropTypes.string,
  disabled: PropTypes.bool,
  menuStyle: PropTypes.instanceOf(Object),
  wrapperStyle: PropTypes.instanceOf(Object),
  buttonRef: PropTypes.instanceOf(Object),
};

export default ButtonWithMenu;
