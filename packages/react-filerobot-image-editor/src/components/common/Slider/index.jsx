import cx from 'classnames';
import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import SliderView from 'ui/Slider';
import useSliderControl from './useSliderControl';
import SliderStyles from './Slider.module.css';

const Slider = ({
  onChange,
  width,
  noMargin = false,
  className,
  style,
  min = 0,
  max = 100,
  step = 1,
  value,
  annotation = '',
  hideTrack = false,
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const {
    theme: { palette },
  } = useStore();
  const {
    rootRef,
    inputRef,
    value: currentValue,
    percent,
    onChange: changeInput,
    ...pointerHandlers
  } = useSliderControl({
    value,
    min,
    max,
    step,
    disabled,
    onChange: (_event, next) => onChange(next),
  });

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
        disabled,
        onChange: changeInput,
        'aria-label': ariaLabel,
        'aria-valuetext': annotation
          ? `${currentValue} ${annotation}`
          : undefined,
      }}
      percent={percent}
      annotation={annotation}
      hideTrack={hideTrack}
      style={{
        '--fie-range-color':
          palette[
            disabled ? 'accent-primary-disabled' : 'border-active-bottom'
          ],
        '--fie-range-focus': palette['accent-primary'],
        '--fie-range-label-background': palette['link-stateless'],
        '--fie-range-annotation-color': palette['txt-secondary'],
        '--fie-slider-width': width || '104px',
        ...style,
      }}
      className={cx(
        SliderStyles.slider,
        !noMargin && SliderStyles.withMargin,
        className,
      )}
    />
  );
};

Slider.propTypes = {
  onChange: PropTypes.func.isRequired,
  width: PropTypes.string,
  noMargin: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
  annotation: PropTypes.string,
  hideTrack: PropTypes.bool,
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string,
};

export default Slider;
