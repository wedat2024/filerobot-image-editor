/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import Label from '@scaleflex/ui/core/label';

/** InternalDependencies */
import AnnotationOptionsStyles from 'components/common/AnnotationOptions/AnnotationOptions.module.css';

import restrictNumber from 'utils/restrictNumber';
import Slider from 'components/common/Slider';

const MIN_VALUE = 3;
const MAX_VALUE = 25;

const PolygonSidesField = ({
  annotation: polygon,
  updateAnnotation: updatePolygon,
  t,
}) => {
  const { sides } = polygon;

  const updateSidesNumber = (newSidesNumber) => {
    updatePolygon({
      sides: restrictNumber(newSidesNumber, MIN_VALUE, MAX_VALUE),
    });
  };

  return (
    <div className={AnnotationOptionsStyles.spacedOptionFields}>
      <Label>{t('sides')}</Label>
      <Slider
        annotation=""
        onChange={updateSidesNumber}
        value={sides}
        min={MIN_VALUE}
        max={MAX_VALUE}
      />
    </div>
  );
};

PolygonSidesField.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default PolygonSidesField;
