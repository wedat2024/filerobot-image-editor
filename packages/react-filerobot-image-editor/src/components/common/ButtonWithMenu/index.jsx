import FieMainButton from 'components/common/Button';

import ThemeScope from 'context/CssTheme';
/** External Dependencies */
import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import useFieldId from 'hooks/useFieldId';
import ActionMenu from 'components/common/ActionMenu';
import triggerKeyboard from 'components/common/ActionMenu/triggerKeyboard';

import ButtonWithMenuStyles from './ButtonWithMenu.module.css';

const ButtonWithMenu = ({
  ButtonComponent = FieMainButton,
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

  const menuId = useFieldId();
  const [initialFocus, setInitialFocus] = useState('first');

  const buttonSize = 'sm';

  const filteredMenuItems = menuItems.filter(Boolean);
  const hasMultipleMenuItems = filteredMenuItems.length > 1;

  const openMenu = (e, focus = 'first') => {
    if (isMounted.current) {
      setInitialFocus(focus);
      setAnchorEl(e.currentTarget);
    }
  };

  const closeMenu = () => {
    if (isMounted.current) {
      setAnchorEl(null);
    }
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
        <ButtonComponent
          id={`${menuId}-trigger`}
          aria-haspopup={
            menuFromBtn && hasMultipleMenuItems ? 'menu' : undefined
          }
          aria-expanded={
            menuFromBtn && hasMultipleMenuItems ? Boolean(anchorEl) : undefined
          }
          aria-controls={anchorEl ? menuId : undefined}
          {...(menuFromBtn && hasMultipleMenuItems && !disabled
            ? triggerKeyboard(openMenu)
            : {})}
          color={color}
          size={buttonSize}
          title={title}
          onClick={disabled ? undefined : handleButtonClick}
          disabled={disabled}
          className={cx(ButtonWithMenuStyles.mainButton, `${className}-button`)}
        >
          {label || t('saveAs')}
        </ButtonComponent>
      </div>
      {/* Preserve the former closed Menu slot in flex layouts. */}
      {hasMultipleMenuItems && !anchorEl && <div aria-hidden="true" />}
      {hasMultipleMenuItems && anchorEl && (
        <ThemeScope
          as={ActionMenu}
          id={menuId}
          aria-labelledby={`${menuId}-trigger`}
          anchor={anchorEl}
          initialFocus={initialFocus}
          onClose={closeMenu}
          items={filteredMenuItems}
          style={menuStyle}
          position={menuPosition}
          className={cx(ButtonWithMenuStyles.menu, `${className}-menu`)}
          itemClassName={cx(
            ButtonWithMenuStyles.menuItem,
            `${className}-menu-item`,
          )}
          iconClassName={ButtonWithMenuStyles.menuIcon}
        />
      )}
    </>
  );
};

ButtonWithMenu.defaultProps = {
  ButtonComponent: FieMainButton,
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
  ButtonComponent: PropTypes.elementType,
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
