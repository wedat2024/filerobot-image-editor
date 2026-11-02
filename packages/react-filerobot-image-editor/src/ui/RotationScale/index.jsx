import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './RotationScale.module.css';

const RotationScale = ({ marks }) => (
  <ul className={cx(styles.list, 'SfxRotationSlider-list')} aria-hidden="true">
    {marks.map(({ value, major, label }) => (
      <li
        key={value}
        className={cx(
          styles.mark,
          major
            ? 'SfxRotationSlider-mark'
            : 'SfxRotationSlider-small-dot-wrapper',
        )}
      >
        {label !== undefined && (
          <span className={cx(styles.label, 'SfxRotationSlider-mark-text')}>
            {label}
            <sup>°</sup>
          </span>
        )}
        <span
          className={cx(
            styles.dot,
            major && styles.major,
            major ? 'SfxRotationSlider-big-dot' : 'SfxRotationSlider-small-dot',
          )}
        />
      </li>
    ))}
  </ul>
);

RotationScale.propTypes = {
  marks: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      major: PropTypes.bool.isRequired,
      label: PropTypes.number,
    }),
  ).isRequired,
};

export default RotationScale;
