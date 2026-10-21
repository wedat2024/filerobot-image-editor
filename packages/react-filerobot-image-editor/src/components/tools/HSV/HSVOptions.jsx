import {
  Label as FieSliderLabel,
  Input as FieSliderInput,
} from '@scaleflex/ui/core';

/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Konva from 'konva';

/** Internal Dependencies */
import { useFinetune, usePhoneScreen } from 'hooks';
import Slider from 'components/common/Slider';

import toolsStyles from '../tools.module.css';

const DEFAULT_VALUE = {
  hue: 0,
  saturation: 0,
  value: 0,
};

const MAX_VALUE = {
  hue: 259,
  saturation: 10,
  value: 2,
};

const sliderStyle = { padding: 0, margin: 0 };

const isPhoneScreen = usePhoneScreen();

const HSVOptions = ({ t }) => {
  const [finetuneProps, setFinetuneProps] = useFinetune(
    Konva.Filters.HSV,
    DEFAULT_VALUE,
  );

  const changeValue = (name, value) => {
    setFinetuneProps({
      [name]: value > MAX_VALUE[name] ? MAX_VALUE[name] : +value,
    });
  };

  return (
    <div
      className={cx(toolsStyles.hSVOptions, isPhoneScreen && toolsStyles.phone)}
    >
      <div
        className={cx(toolsStyles.sliderContainer, 'FIE_hue-option-wrapper')}
      >
        <FieSliderLabel
          className={cx(toolsStyles.sliderLabel, 'FIE_hue-option-label')}
        >
          {t('hue')}
        </FieSliderLabel>
        <div className={toolsStyles.sliderWrapper}>
          <Slider
            className="FIE_hue-option"
            min={0}
            step={1}
            max={259}
            value={finetuneProps.hue ?? DEFAULT_VALUE.hue}
            onChange={(val) => changeValue('hue', val)}
            style={sliderStyle}
          />
          <FieSliderInput
            value={finetuneProps.hue ?? DEFAULT_VALUE.hue}
            onChange={({ target: { value } }) => changeValue('hue', value)}
            className={toolsStyles.sliderInput}
          />
        </div>
      </div>
      <div
        className={cx(
          toolsStyles.sliderContainer,
          'FIE_saturation-option-wrapper',
        )}
      >
        <FieSliderLabel
          className={cx(toolsStyles.sliderLabel, 'FIE_saturation-option-label')}
        >
          {t('saturation')}
        </FieSliderLabel>
        <div className={toolsStyles.sliderWrapper}>
          <Slider
            className="FIE_saturation-option"
            min={-2}
            step={0.5}
            max={10}
            value={finetuneProps.saturation ?? DEFAULT_VALUE.saturation}
            onChange={(val) => changeValue('saturation', val)}
            style={sliderStyle}
          />
          <FieSliderInput
            value={finetuneProps.saturation ?? DEFAULT_VALUE.saturation}
            onChange={({ target: { value } }) =>
              changeValue('saturation', value)
            }
            className={toolsStyles.sliderInput}
          />
        </div>
      </div>
      <div
        className={cx(toolsStyles.sliderContainer, 'FIE_value-option-wrapper')}
      >
        <FieSliderLabel
          className={cx(toolsStyles.sliderLabel, 'FIE_value-option-label')}
        >
          {t('value')}
        </FieSliderLabel>
        <div className={toolsStyles.sliderWrapper}>
          <Slider
            className="FIE_value-option"
            min={-2}
            step={0.1}
            max={2}
            value={finetuneProps.value ?? DEFAULT_VALUE.value}
            onChange={(val) => changeValue('value', val)}
            style={sliderStyle}
          />
          <FieSliderInput
            value={finetuneProps.value ?? DEFAULT_VALUE.value}
            onChange={({ target: { value } }) => changeValue('value', value)}
            className={toolsStyles.sliderInput}
          />
        </div>
      </div>
    </div>
  );
};

HSVOptions.propTypes = {
  t: PropTypes.func.isRequired,
};

export default HSVOptions;
