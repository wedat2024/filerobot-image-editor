import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './Slider.module.css';

// Rendering only. Pointer/value handling and theme adaptation live in common.
const Slider = forwardRef(
  (
    {
      className,
      inputRef,
      inputProps,
      percent,
      annotation,
      hideTrack,
      rotation,
      rail,
      ...props
    },
    ref,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(styles.root, 'SfxSlider-root', className)}
    >
      {rail || <span className={cx(styles.rail, 'SfxSlider-rail')} />}
      {!hideTrack && (
        <span
          className={cx(styles.track, 'SfxSlider-Track')}
          style={{ left: 0, width: `${percent}%` }}
        />
      )}
      <span
        className={cx(
          styles.thumb,
          rotation && styles.rotation,
          rotation ? 'SfxRotationSlider-control' : 'SfxSlider-thumb',
        )}
        style={{ left: `${percent}%` }}
      >
        <input
          {...inputProps}
          ref={inputRef}
          className={styles.input}
          type="range"
        />
        <span className={styles.focusRing} />
        <span
          aria-hidden="true"
          className={cx(styles.value, 'SfxSlider-label')}
        >
          {inputProps.value}
          {annotation && ` ${annotation}`}
        </span>
      </span>
      {!rotation && (
        <div
          aria-hidden="true"
          className={cx(styles.annotation, 'SfxSlider-annotation')}
        >
          <span>
            {inputProps.min}
            {annotation && ` ${annotation}`}
          </span>
          <span>
            {inputProps.max}
            {annotation && ` ${annotation}`}
          </span>
        </div>
      )}
    </span>
  ),
);

Slider.displayName = 'Slider';
Slider.defaultProps = {
  className: undefined,
  annotation: '',
  hideTrack: false,
  rotation: false,
  rail: undefined,
};
Slider.propTypes = {
  className: PropTypes.string,
  inputRef: PropTypes.instanceOf(Object).isRequired,
  inputProps: PropTypes.instanceOf(Object).isRequired,
  percent: PropTypes.number.isRequired,
  annotation: PropTypes.string,
  hideTrack: PropTypes.bool,
  rotation: PropTypes.bool,
  rail: PropTypes.node,
};

export default Slider;
