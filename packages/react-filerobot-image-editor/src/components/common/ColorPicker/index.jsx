import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { PinOutline, DeleteOutline } from '@scaleflex/icons';

import { useStore } from 'hooks';
import useFieldId from 'hooks/useFieldId';
import ColorPickerView from 'ui/ColorPicker';
import Input from 'components/common/Input';
import Select from 'components/common/Select';
import {
  channels,
  colorPosition,
  initialHex,
  isTransparent,
  positionHex,
  rgbHex,
  rgbText,
  toHsl,
  transparent,
  transparentHex,
  validHex,
} from './colorMath';
import styles from './ColorPicker.module.css';

const clamp = (value, max) => Math.min(max, Math.max(0, value));

const ColorPicker = ({ defaultColor, pinnedColors, onChange }) => {
  const {
    t,
    theme: { palette },
  } = useStore();
  const id = useFieldId();
  const squareRef = useRef(null);
  const barRef = useRef(null);
  const pointer = useRef(null);
  const [color, setColor] = useState(() => initialHex(defaultColor));
  const [draft, setDraft] = useState(color);
  const [rgb, setRgb] = useState(() => channels(color));
  const [format, setFormat] = useState('hex');
  const [colors, setColors] = useState(() => [transparent, ...pinnedColors]);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [bar, setBar] = useState({ hue: 0, left: 0 });

  const emit = (next, pinned = colors) =>
    onChange(
      next,
      rgbText(next),
      pinned.filter((entry) => entry !== transparent),
    );

  const moveHueToColor = (next) => {
    const [hue] = toHsl(next);
    const stop = barRef.current.querySelector(`[data-hue="${hue}"]`);

    if (stop) {
      const left =
        Math.round(stop.getBoundingClientRect().left + window.scrollX) -
        Math.round(
          barRef.current.getBoundingClientRect().left + window.scrollX,
        );
      setBar((previous) => ({ hue, left: left || previous.left }));
    }
  };

  const selectColor = (next) => {
    const normalized = isTransparent(next) ? transparentHex : next;
    const bounds = squareRef.current.getBoundingClientRect();
    const hsv = colorPosition(normalized);

    setColor(normalized);
    setPosition({
      left: (hsv.saturation * bounds.width) / 100,
      top: bounds.height * (1 - hsv.value / 100),
    });
    moveHueToColor(normalized);
    // Transparent selection historically exposes four RGB fields until reopen.
    setRgb(
      next.startsWith('rgb')
        ? next
            .replace(/[^\d,]/g, '')
            .split(',')
            .map(Number)
        : channels(next),
    );
    emit(normalized);
  };

  useEffect(() => {
    selectColor(color);
  }, []);

  useEffect(() => {
    setDraft(color);
    setRgb(channels(color));
  }, [color]);

  const changePosition = (left, top, hue = bar.hue) => {
    const bounds = squareRef.current.getBoundingClientRect();
    const nextPosition = {
      left: clamp(left, bounds.width),
      top: clamp(top, bounds.height),
    };
    const next = positionHex(
      hue,
      nextPosition.left / bounds.width,
      1 - nextPosition.top / bounds.height,
    );

    setPosition(nextPosition);
    setColor(next);
    emit(next);
  };

  const changeHue = (left, apply = true) => {
    const { width } = barRef.current.getBoundingClientRect();
    const hue = clamp(Math.round((left / width) * 360), 360);

    setBar({ hue, left: clamp(left, width) });
    if (apply) changePosition(position.left, position.top, hue);
  };

  const updatePointer = (event, kind) => {
    const bounds = (
      kind === 'hue' ? barRef : squareRef
    ).current.getBoundingClientRect();

    const left = event.pageX - Math.round(bounds.left + window.scrollX);
    const top = event.pageY - Math.round(bounds.top + window.scrollY);

    if (kind === 'hue') changeHue(left);
    else changePosition(left, top);
  };

  const pointerProps = (kind) => ({
    onPointerDown: (event) => {
      if (event.button !== 0 || pointer.current) return;

      event.preventDefault();
      pointer.current = { id: event.pointerId, kind };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus({ preventScroll: true });
      updatePointer(event, kind);
    },
    onPointerMove: (event) => {
      if (
        pointer.current?.id === event.pointerId &&
        pointer.current.kind === kind
      )
        updatePointer(event, kind);
    },
    onPointerUp: (event) => {
      if (pointer.current?.id !== event.pointerId) return;

      pointer.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    onPointerCancel: () => {
      pointer.current = null;
    },
    onLostPointerCapture: () => {
      pointer.current = null;
    },
  });

  const changeHex = (event) => {
    const next = event.target.value;

    if (validHex(next)) selectColor(next);
    setDraft(next);
  };

  const changeRgb = (event, index) => {
    const value = Number(event.target.value);
    if (value > 255 || Number.isNaN(value)) return;

    const nextRgb = rgb.map((channel, channelIndex) =>
      channelIndex === index ? value : channel,
    );
    const next = rgbHex(nextRgb);

    setRgb(nextRgb);
    if (validHex(next)) {
      setColor(next);
      moveHueToColor(next);
    }
    // Keep legacy behavior: RGB typing changes the picker, not the editor callback.
  };

  const pinned = colors.includes(color);
  const togglePinned = () => {
    const next = pinned
      ? colors.filter((entry) => entry !== color)
      : [...colors, color];

    setColors(next);
    emit(color, next);
  };

  const controls = (
    <>
      <div
        className={`${styles.select} SfxColorPicker-select`}
        data-format={format}
      >
        <Select
          aria-label={t('colorFormat')}
          value={format}
          onChange={setFormat}
          fullWidth
          menuStyle={{ zIndex: 11112 }}
          options={[
            { value: 'hex', label: 'Hex' },
            { value: 'rgb', label: 'RGB' },
          ]}
        />
      </div>
      {format === 'hex' ? (
        <Input
          aria-label="Hex"
          size="sm"
          value={draft}
          error={!/^#([\da-f]{3}){1,2}$/i.test(color)}
          onChange={changeHex}
          style={{ width: '45%' }}
        />
      ) : (
        rgb.map((channel, index) => (
          <Input
            key={['R', 'G', 'B', 'A'][index]}
            aria-label={['R', 'G', 'B', 'A'][index]}
            size="sm"
            value={channel}
            onChange={(event) => changeRgb(event, index)}
            style={{ width: '20%' }}
          />
        ))
      )}
      {color !== transparentHex && (
        <button
          type="button"
          aria-label={t(pinned ? 'unpinColor' : 'pinColor')}
          onClick={togglePinned}
          className={`${styles.pin} SfxColorPicker-icon`}
        >
          {pinned ? <DeleteOutline /> : <PinOutline />}
        </button>
      )}
    </>
  );

  return (
    <ColorPickerView
      id={id}
      controls={controls}
      color={draft}
      hueColor={`hsl(${bar.hue}, 100%, 50%)`}
      position={position}
      hueLeft={bar.left}
      squareRef={squareRef}
      barRef={barRef}
      colors={colors.map((entry) => ({
        value: entry,
        checked:
          entry === color ||
          (entry === transparent && color === transparentHex),
      }))}
      onSelect={selectColor}
      labels={{ transparent: t('transparentColor') }}
      style={{
        '--fie-color-background': palette['bg-secondary'],
        '--fie-color-grid': palette['link-primary'],
        '--fie-color-focus': palette['accent-primary'],
      }}
      squareProps={{
        ...pointerProps('square'),
        tabIndex: 0,
        role: 'group',
        'aria-label': t('colorSaturationBrightness'),
        onKeyDown: (event) => {
          if (
            !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
              event.key,
            )
          )
            return;

          event.preventDefault();
          changePosition(
            position.left +
              (event.key === 'ArrowRight' ? 1 : 0) -
              (event.key === 'ArrowLeft' ? 1 : 0),
            position.top +
              (event.key === 'ArrowDown' ? 1 : 0) -
              (event.key === 'ArrowUp' ? 1 : 0),
          );
        },
      }}
      hueProps={{
        ...pointerProps('hue'),
        tabIndex: 0,
        role: 'slider',
        'aria-label': t('hue'),
        'aria-valuemin': 0,
        'aria-valuemax': 360,
        'aria-valuenow': bar.hue,
        onKeyDown: (event) => {
          if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;

          event.preventDefault();
          changeHue(bar.left + (event.key === 'ArrowLeft' ? -1 : 1), false);
        },
      }}
    />
  );
};

ColorPicker.defaultProps = { defaultColor: '', pinnedColors: [] };
ColorPicker.propTypes = {
  defaultColor: PropTypes.string,
  pinnedColors: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

export default ColorPicker;
