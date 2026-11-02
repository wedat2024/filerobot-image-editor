import React from 'react';
import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import SliderView from 'ui/Slider';
import RotationScale from 'ui/RotationScale';
import useSliderControl from 'components/common/Slider/useSliderControl';

const RotationSlider = ({
  min,
  max,
  step,
  angle,
  value,
  onChange,
  className,
}) => {
  const {
    t,
    theme: { palette },
  } = useStore();
  const currentValue = Math.max(min, Math.min(max, value ?? min));
  const {
    rootRef,
    inputRef,
    percent,
    onChange: changeInput,
    value: unusedValue,
    ...pointerHandlers
  } = useSliderControl({
    value: currentValue,
    min,
    max,
    step,
    disabled: false,
    onChange,
  });
  const marks = [];

  for (let tick = min; tick <= max; tick += step) {
    const major = tick % angle === 0 || tick === max;

    if (major || tick % 10 === 0) {
      marks.push({
        value: tick,
        major,
        label: major && currentValue === tick ? tick : undefined,
      });
    }
  }

  return (
    <SliderView
      {...pointerHandlers}
      ref={rootRef}
      inputRef={inputRef}
      inputProps={{
        min,
        max,
        step,
        value: currentValue,
        onChange: changeInput,
        'aria-label': t('rotateTool'),
        'aria-valuetext': `${currentValue}°`,
      }}
      percent={percent}
      annotation="°"
      rotation
      hideTrack
      rail={<RotationScale marks={marks} />}
      className={className}
      style={{
        width: 'auto',
        height: 'auto',
        '--fie-range-color': palette['border-active-bottom'],
        '--fie-range-focus': palette['accent-primary'],
        '--fie-range-control': palette['link-active'],
        '--fie-range-dot': palette['link-primary'],
        '--fie-range-text': palette['txt-primary'],
        '--fie-range-label-background': palette['link-stateless'],
      }}
    />
  );
};

RotationSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default RotationSlider;
