/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import Konva from 'konva';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useFinetune } from 'hooks';
import restrictNumber from 'utils/restrictNumber';
import Slider from 'components/common/Slider';
import FieSliderInput from 'components/common/Input';
import FieSliderLabel from 'components/common/Label';
import useFieldId from 'hooks/useFieldId';

import toolsStyles from '../tools.module.css';

const MIN_VALUE = -1;
const DEFAULT_VALUE = {
  brightness: 0,
};
const MAX_VALUE = 1;
const sliderStyle = { width: 150, padding: 0, margin: 0 };

const BrightnessOptions = ({ t }) => {
  const brightnessId = useFieldId();

  const [finetuneProps, setFinetuneProps] = useFinetune(
    Konva.Filters.Brighten,
    DEFAULT_VALUE,
  );

  const changeValue = (value) => {
    setFinetuneProps({
      brightness: restrictNumber(value, MIN_VALUE, MAX_VALUE),
    });
  };

  return (
    <div
      className={cx(
        toolsStyles.sliderContainer,
        'FIE_brightness-option-wrapper',
      )}
    >
      <FieSliderLabel
        htmlFor={brightnessId}
        className={cx(toolsStyles.sliderLabel, 'FIE_brightness-option-label')}
      >
        {t('brightness')}
      </FieSliderLabel>
      <div className={toolsStyles.sliderWrapper}>
        <Slider
          aria-label={t('brightness')}
          className="FIE_brightness-option"
          min={MIN_VALUE}
          step={0.05}
          max={MAX_VALUE}
          width="124px"
          value={finetuneProps.brightness ?? DEFAULT_VALUE.brightness}
          onChange={changeValue}
          style={sliderStyle}
        />
        <FieSliderInput
          id={brightnessId}
          value={finetuneProps.brightness ?? DEFAULT_VALUE.brightness}
          onChange={({ target: { value } }) => changeValue(value)}
          className={toolsStyles.sliderInput}
        />
      </div>
    </div>
  );
};

BrightnessOptions.propTypes = {
  t: PropTypes.func.isRequired,
};

export default BrightnessOptions;
