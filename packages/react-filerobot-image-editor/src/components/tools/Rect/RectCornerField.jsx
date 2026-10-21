/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import Label from '@scaleflex/ui/core/label';

/** InternalDependencies */
import AnnotationOptionsStyles from 'components/common/AnnotationOptions/AnnotationOptions.module.css';
import restrictNumber from 'utils/restrictNumber';
import Slider from 'components/common/Slider';

const MIN_VALUE = 0;
const MAX_VALUE = 150;

const RectCornerField = ({
  annotation: rect,
  updateAnnotation: updateRect,
  t,
}) => {
  const { cornerRadius } = rect;

  const updateCornerRadius = (newCornerRadius) => {
    updateRect({
      cornerRadius: restrictNumber(newCornerRadius, MIN_VALUE, MAX_VALUE),
    });
  };

  return (
    <div className={AnnotationOptionsStyles.spacedOptionFields}>
      <Label>{t('cornerRadius')}</Label>
      <Slider
        annotation="px"
        onChange={updateCornerRadius}
        value={cornerRadius}
        min={MIN_VALUE}
        max={MAX_VALUE}
      />
    </div>
  );
};

RectCornerField.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default RectCornerField;
