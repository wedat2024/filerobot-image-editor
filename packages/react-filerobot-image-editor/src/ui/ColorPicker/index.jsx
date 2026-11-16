import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tick from '@scaleflex/icons/tick';

import styles from './ColorPicker.module.css';

// Layout only. Color conversion, state, theme and interaction live in common.
const ColorPicker = ({
  controls,
  id,
  color,
  hueColor,
  position,
  hueLeft,
  squareRef,
  barRef,
  squareProps,
  hueProps,
  colors,
  onSelect,
  labels,
  style,
}) => (
  <div
    className={cx(styles.root, 'SfxColorPicker-root')}
    style={{ ...style, '--fie-color-pointer': color }}
  >
    <div className={cx(styles.actions, 'SfxColorPicker-action')}>
      {controls}
    </div>
    <div
      {...squareProps}
      ref={squareRef}
      className={cx(styles.square, 'SfxColorPicker-range-picker')}
      style={{ backgroundColor: hueColor }}
    >
      <div className={cx(styles.white, 'SfxColorPicker-white-gradient')} />
      <div className={cx(styles.black, 'SfxColorPicker-black-gradient')} />
      <span
        aria-hidden="true"
        className={cx(styles.pointer, 'SfxColorPicker-pointer')}
        style={{
          left: position.left - 7,
          top: position.top - 7,
          backgroundColor: 'var(--fie-color-pointer)',
        }}
      />
    </div>
    <div {...hueProps} className={cx(styles.hue, 'SfxColorPicker-bar-wrapper')}>
      <table
        ref={barRef}
        className={cx(styles.bar, 'SfxColorPicker-bar')}
        aria-hidden="true"
      >
        <tbody>
          <tr>
            {Array.from({ length: 361 }, (_, hue) => (
              <td
                key={hue}
                data-hue={hue}
                aria-label={`${hue}°`}
                className={cx(styles.stop, 'SfxColorPicker-stop')}
                style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
              />
            ))}
          </tr>
        </tbody>
      </table>
      <span
        aria-hidden="true"
        className={cx(styles.pointer, 'SfxColorPicker-pointer')}
        style={{
          left: hueLeft - 7,
          top: -3,
          backgroundColor: 'var(--fie-color-pointer)',
        }}
      />
    </div>
    <div className={styles.colors}>
      {colors.map(({ value, checked }) => (
        <div className="item" key={value}>
          <label
            htmlFor={`${id}-${value}`}
            className={cx(styles.swatch, 'SfxColorItem-label')}
            style={{
              backgroundColor: value,
              borderColor: value === 'rgba(0,0,0,0)' ? '#a8a8a8' : '#E9EEF2',
            }}
            data-transparent={value === 'rgba(0,0,0,0)' || undefined}
          >
            <input
              id={`${id}-${value}`}
              type="radio"
              aria-label={
                value === 'rgba(0,0,0,0)' ? labels.transparent : value
              }
              value={value}
              checked={checked}
              onChange={() => onSelect(value)}
            />
            {checked && (
              <Tick
                color={
                  value === '#ffffff' || value === 'rgba(0,0,0,0)'
                    ? 'black'
                    : 'white'
                }
              />
            )}
          </label>
        </div>
      ))}
    </div>
  </div>
);

ColorPicker.propTypes = {
  controls: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  hueColor: PropTypes.string.isRequired,
  position: PropTypes.instanceOf(Object).isRequired,
  hueLeft: PropTypes.number.isRequired,
  squareRef: PropTypes.instanceOf(Object).isRequired,
  barRef: PropTypes.instanceOf(Object).isRequired,
  squareProps: PropTypes.instanceOf(Object).isRequired,
  hueProps: PropTypes.instanceOf(Object).isRequired,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  labels: PropTypes.instanceOf(Object).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

export default ColorPicker;
