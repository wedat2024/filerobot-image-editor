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

const MIN_VALUE = 0;
const DEFAULT_VALUE = {
  blurRadius: MIN_VALUE,
};
const MAX_VALUE = 100;
const sliderStyle = { width: 150, padding: 0, margin: 0 };

const BlurOptions = ({ t }) => {
  const blurId = useFieldId();

  const [finetuneProps, setFinetuneProps] = useFinetune(
    Konva.Filters.Blur,
    DEFAULT_VALUE,
  );

  const changeValue = (value) => {
    setFinetuneProps({
      blurRadius: restrictNumber(value, MIN_VALUE, MAX_VALUE),
    });
  };

  return (
    <div className={cx(toolsStyles.sliderContainer, 'FIE_blur-option-wrapper')}>
      <FieSliderLabel
        htmlFor={blurId}
        className={cx(toolsStyles.sliderLabel, 'FIE_blur-option-label')}
      >
        {t('blur')}
      </FieSliderLabel>
      <div className={toolsStyles.sliderWrapper}>
        <Slider
          aria-label={t('blur')}
          className="FIE_blur-option"
          min={MIN_VALUE}
          max={MAX_VALUE}
          width="124px"
          value={finetuneProps.blurRadius ?? DEFAULT_VALUE.blurRadius}
          onChange={changeValue}
          style={sliderStyle}
        />
        <FieSliderInput
          id={blurId}
          value={finetuneProps.blurRadius ?? DEFAULT_VALUE.blurRadius}
          onChange={({ target: { value } }) => changeValue(value)}
          className={toolsStyles.sliderInput}
        />
      </div>
    </div>
  );
};

BlurOptions.propTypes = {
  t: PropTypes.func.isRequired,
};

export default BlurOptions;
