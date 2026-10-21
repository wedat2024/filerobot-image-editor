import FieSlider from '@scaleflex/ui/core/slider';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import SliderStyles from './Slider.module.css';

const Slider = ({ onChange, width, noMargin, className, style, ...props }) => {
  return (
    <FieSlider
      annotation=""
      onChange={(_e, val) => (onChange ? onChange(val) : undefined)}
      {...props}
      style={{ '--fie-slider-width': width || '104px', ...style }}
      className={cx(
        SliderStyles.slider,
        !noMargin && SliderStyles.withMargin,
        className,
      )}
    />
  );
};

Slider.defaultProps = {
  width: undefined,
  noMargin: false,
  className: undefined,
  style: undefined,
};

Slider.propTypes = {
  onChange: PropTypes.func.isRequired,
  width: PropTypes.string,
  noMargin: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
};

export default Slider;
