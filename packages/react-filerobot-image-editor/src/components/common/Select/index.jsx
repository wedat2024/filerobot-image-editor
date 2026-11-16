import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import useFieldId from 'hooks/useFieldId';
import SelectTrigger from 'ui/SelectTrigger';
import SelectOption from 'ui/SelectOption';
import AnchoredMenu from 'components/common/AnchoredMenu';

// The editor uses single, small Selects only. Values remain strings or numbers.
const Select = ({
  options,
  value,
  onChange,
  id,
  fullWidth,
  menuStyle,
  style,
  ...props
}) => {
  const {
    theme: { palette, shape, typography },
  } = useStore();
  const generatedId = useFieldId();
  const triggerId = id || generatedId;
  const listId = `${triggerId}-list`;
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const searchRef = useRef({ text: '', time: 0 });
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const selected = options.findIndex((option) => option.value === value);

  const close = () => {
    setOpen(false);
    setHighlighted(-1);
    searchRef.current = { text: '', time: 0 };
  };

  const choose = (index) => {
    close();
    if (options[index]) onChange(options[index].value);
  };

  const openList = (keyboard = false) => {
    setOpen(true);
    setHighlighted(keyboard ? Math.max(0, selected) : -1);
  };

  useEffect(() => {
    if (open && highlighted >= 0) {
      optionRefs.current[highlighted]?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, highlighted]);

  const onKeyDown = (event) => {
    const { key } = event;

    if (key === 'Escape' && !open) return;

    if (key === 'Tab') {
      if (open && highlighted >= 0) choose(highlighted);
      else close();
      return;
    }

    if (
      ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'].includes(
        key,
      )
    ) {
      event.preventDefault();
      event.stopPropagation();

      if (key === 'Escape') close();
      else if (key === 'Enter' || key === ' ') {
        if (open) choose(highlighted < 0 ? selected : highlighted);
        else openList(true);
      } else {
        setOpen(true);
        if (key === 'Home') setHighlighted(0);
        else if (key === 'End') setHighlighted(options.length - 1);
        else if (!open) setHighlighted(Math.max(0, selected));
        else
          setHighlighted(
            Math.max(
              0,
              Math.min(
                options.length - 1,
                (highlighted < 0 ? selected : highlighted) +
                  (key === 'ArrowDown' ? 1 : -1),
              ),
            ),
          );
      }
      return;
    }

    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      event.stopPropagation();

      const previous = searchRef.current;
      const text =
        (Date.now() - previous.time < 700 ? previous.text : '') +
        key.toLowerCase();
      const repeated = Array.from(text).every((letter) => letter === text[0]);
      const query = repeated ? text[0] : text;
      const start = repeated ? highlighted + 1 : 0;
      const index = options
        .map(
          (option, offset) =>
            (start + offset + options.length) % options.length,
        )
        .find((offset) =>
          options[offset].label.toLowerCase().startsWith(query),
        );

      searchRef.current = { text, time: Date.now() };
      setOpen(true);
      if (index !== undefined) setHighlighted(index);
    }
  };

  return (
    <>
      <SelectTrigger
        {...props}
        id={triggerId}
        ref={triggerRef}
        fullWidth={fullWidth}
        hasValue={
          value !== null && value !== undefined && String(value).length > 0
        }
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && options[highlighted] ? `${listId}-${highlighted}` : undefined
        }
        onClick={() => {
          if (open) close();
          else openList();
        }}
        onKeyDown={onKeyDown}
        onKeyUp={(event) => {
          // Selecting with Enter must not bubble into Modal's save shortcut.
          if (event.key === 'Enter' || event.key === ' ')
            event.stopPropagation();
        }}
        onBlur={close}
        style={{
          ...typography.font['input-md'],
          '--fie-select-radius': shape.borderRadius.md,
          '--fie-select-background': palette['bg-stateless'],
          '--fie-select-color': palette['txt-primary'],
          '--fie-select-hover-border': palette['borders-primary-hover'],
          '--fie-select-focus': palette['accent-stateless'],
          '--fie-select-placeholder': palette['txt-placeholder'],
          '--fie-select-icon': palette['icon-primary'],
          ...style,
        }}
      >
        {options[selected]?.label}
      </SelectTrigger>
      {open && (
        <AnchoredMenu
          style={menuStyle}
          anchor={triggerRef.current}
          onClose={close}
          id={listId}
          role="listbox"
          aria-label={props['aria-label']}
          aria-labelledby={props['aria-labelledby']}
        >
          {options.map((option, index) => (
            <SelectOption
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              id={`${listId}-${index}`}
              selected={index === selected}
              highlighted={index === highlighted}
              className={option.className}
              style={typography.font['label-medium']}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              {option.label}
            </SelectOption>
          ))}
        </AnchoredMenu>
      )}
    </>
  );
};

Select.defaultProps = {
  value: undefined,
  id: undefined,
  fullWidth: false,
  menuStyle: undefined,
  style: undefined,
  'aria-label': undefined,
  'aria-labelledby': undefined,
};
Select.propTypes = {
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  fullWidth: PropTypes.bool,
  menuStyle: PropTypes.instanceOf(Object),
  style: PropTypes.instanceOf(Object),
};

export default Select;
