import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import AnchoredMenu from 'components/common/AnchoredMenu';
import MenuItem from 'ui/MenuItem';

const ActionMenu = ({
  anchor,
  items,
  onClose,
  initialFocus,
  itemClassName,
  iconClassName,
  ...props
}) => {
  const {
    theme: { typography },
  } = useStore();
  const itemRefs = useRef([]);

  const focusItem = (index) => {
    itemRefs.current[index]?.focus({ preventScroll: true });
    itemRefs.current[index]?.scrollIntoView({ block: 'nearest' });
  };

  useEffect(() => {
    focusItem(initialFocus === 'last' ? items.length - 1 : 0);
  }, []);

  const dismiss = () => {
    anchor.focus({ preventScroll: true });
    onClose();
  };

  const activate = (item) => {
    // Restore first: a callback may open a dialog which must keep its own focus.
    anchor.focus({ preventScroll: true });
    if (typeof item.onClick === 'function') item.onClick();
    onClose();
  };

  const onKeyDown = (event, index) => {
    const { key } = event;

    if (key === 'Tab') {
      // Let native Tab continue from the trigger, not from the body portal.
      dismiss();
      return;
    }

    if (
      ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape', 'Enter', ' '].includes(
        key,
      )
    ) {
      event.preventDefault();
      event.stopPropagation();

      if (key === 'Escape') dismiss();
      else if (key === 'Home') focusItem(0);
      else if (key === 'End') focusItem(items.length - 1);
      else if (key === 'ArrowDown') focusItem((index + 1) % items.length);
      else if (key === 'ArrowUp')
        focusItem((index - 1 + items.length) % items.length);
      return;
    }

    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const next = items
        .map((item, offset) => (index + offset + 1) % items.length)
        .find(
          (offset) =>
            typeof items[offset].label === 'string' &&
            items[offset].label.toLowerCase().startsWith(key.toLowerCase()),
        );

      if (next !== undefined) {
        event.preventDefault();
        focusItem(next);
      }
    }
  };

  return (
    <AnchoredMenu
      {...props}
      anchor={anchor}
      onClose={dismiss}
      role="menu"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onClose();
      }}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const icon =
          typeof Icon === 'string' ? (
            // Keep the existing configured SVG markup contract.
            // eslint-disable-next-line react/no-danger
            <span dangerouslySetInnerHTML={{ __html: Icon }} />
          ) : (
            Icon && <Icon />
          );

        return (
          <MenuItem
            key={`${item.key}-${index.toString()}`}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            active={item.isActive}
            icon={icon}
            className={itemClassName}
            iconClassName={iconClassName}
            style={typography.font['label-medium']}
            onClick={() => activate(item)}
            onKeyDown={(event) => onKeyDown(event, index)}
            onKeyUp={(event) => {
              // Activate on release so Enter cannot leak into a newly opened Modal.
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                activate(item);
              }
            }}
          >
            {item.label}
          </MenuItem>
        );
      })}
    </AnchoredMenu>
  );
};

ActionMenu.defaultProps = {
  initialFocus: 'first',
  itemClassName: undefined,
  iconClassName: undefined,
};
ActionMenu.propTypes = {
  anchor: PropTypes.instanceOf(Object).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  initialFocus: PropTypes.oneOf(['first', 'last']),
  itemClassName: PropTypes.string,
  iconClassName: PropTypes.string,
};

export default ActionMenu;
