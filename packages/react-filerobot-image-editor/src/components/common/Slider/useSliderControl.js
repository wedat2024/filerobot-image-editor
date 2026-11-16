import { useRef, useState } from 'react';

// One value per slider is the editor's current contract. Native range input
// retains keyboard steps; pointer positions use the full legacy root width.
const useSliderControl = ({ value, min, max, step, disabled, onChange }) => {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const pointer = useRef(null);
  const [localValue, setLocalValue] = useState(min);
  const currentValue = value ?? localValue;

  const changeValue = (event, next) => {
    if (value === undefined) setLocalValue(next);
    onChange(event, next);
  };

  const changeFromPointer = (event) => {
    const { left, width } = rootRef.current.getBoundingClientRect();
    const raw = min + ((event.clientX - left) / width) * (max - min);
    const rounded = Math.round((raw - min) / step) * step + min;
    const [coefficient, exponent = '0'] = String(step).toLowerCase().split('e');
    const decimals = Math.max(
      0,
      (coefficient.split('.')[1]?.length || 0) - Number(exponent),
    );
    const next = Math.max(
      min,
      Math.min(max, Number(rounded.toFixed(decimals))),
    );

    changeValue(event, next);
  };

  const releasePointer = (event) => {
    if (pointer.current !== event.pointerId) return;

    pointer.current = null;
    if (rootRef.current.hasPointerCapture(event.pointerId))
      rootRef.current.releasePointerCapture(event.pointerId);
  };

  return {
    rootRef,
    inputRef,
    value: currentValue,
    percent: ((currentValue - min) * 100) / (max - min),
    onChange: (event) => changeValue(event, event.target.valueAsNumber),
    onPointerDown: (event) => {
      if (disabled || event.button !== 0 || pointer.current !== null) return;

      event.preventDefault();
      pointer.current = event.pointerId;
      rootRef.current.setPointerCapture(event.pointerId);
      inputRef.current.focus({ preventScroll: true });
      changeFromPointer(event);
    },
    onPointerMove: (event) => {
      if (pointer.current !== event.pointerId || disabled) return;
      if (event.pointerType === 'mouse' && event.buttons === 0) {
        releasePointer(event);
        return;
      }

      changeFromPointer(event);
    },
    onPointerUp: releasePointer,
    onPointerCancel: releasePointer,
    onLostPointerCapture: () => {
      pointer.current = null;
    },
  };
};

export default useSliderControl;
