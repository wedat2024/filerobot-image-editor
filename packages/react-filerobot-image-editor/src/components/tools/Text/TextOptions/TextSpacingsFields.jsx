/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Label from '@scaleflex/ui/core/label';

/** Internal Dependencies */
import restrictNumber from 'utils/restrictNumber';
import AnnotationOptionsStyles from 'components/common/AnnotationOptions/AnnotationOptions.module.css';
import Slider from 'components/common/Slider';

const MIN_VALUE = 0;
const MAX_VALUE = 100;
const SLIDER_STEP = 1;

const TextSpacingsFields = ({
  annotation: text,
  updateAnnotation: updateText,
  t,
}) => {
  const { letterSpacing, lineHeight } = text;

  const updateValue = (prop, val) => {
    updateText({ [prop]: restrictNumber(val, MIN_VALUE, MAX_VALUE) });
  };

  return (
    <div
      className={cx(
        AnnotationOptionsStyles.spacedOptionFields,
        AnnotationOptionsStyles.block,
      )}
    >
      <Label>{t('letterSpacing')}</Label>
      <Slider
        annotation="px"
        isActive={Boolean(letterSpacing)}
        onChange={(val) => updateValue('letterSpacing', val)}
        value={letterSpacing}
        step={SLIDER_STEP}
      />
      <Label>{t('lineHeight')}</Label>
      <Slider
        annotation="px"
        isActive={Boolean(lineHeight)}
        onChange={(val) => updateValue('lineHeight', val)}
        value={lineHeight}
        step={SLIDER_STEP}
      />
    </div>
  );
};

TextSpacingsFields.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default TextSpacingsFields;
