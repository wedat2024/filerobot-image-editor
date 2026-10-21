import FieIconLabel from '@scaleflex/ui/core/label';
import ThemeScope from 'context/CssTheme';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import restrictNumber from 'utils/restrictNumber';
import { Label } from '@scaleflex/ui/core';

import AnnotationOptionsStyles from './AnnotationOptions.module.css';

import Slider from '../Slider';

const MIN_PERCENTANGE = 0;
const MAX_PERCENTANGE = 1;

const OpacityField = ({ annotation, updateAnnotation, t }) => {
  const { opacity } = annotation;
  const opacityValue = Math.round(opacity * 100);

  const changeOpacity = (newOpactiy) => {
    updateAnnotation({
      opacity: restrictNumber(
        newOpactiy / 100,
        MIN_PERCENTANGE,
        MAX_PERCENTANGE,
      ),
    });
  };

  return (
    <ThemeScope
      as="div"
      className={cx(
        AnnotationOptionsStyles.optionPopupContent,
        AnnotationOptionsStyles.noPadding,
      )}
    >
      <Label>{t('transparency')}</Label>
      <div className={AnnotationOptionsStyles.spacedOptionFields}>
        <Slider
          annotation="%"
          onChange={changeOpacity}
          value={opacityValue}
          noMargin
        />
        <FieIconLabel
          className={AnnotationOptionsStyles.iconLabel}
        >{`${opacityValue}%`}</FieIconLabel>
      </div>
    </ThemeScope>
  );
};

OpacityField.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  t: PropTypes.func.isRequired,
  updateAnnotation: PropTypes.func.isRequired,
};

export default OpacityField;
