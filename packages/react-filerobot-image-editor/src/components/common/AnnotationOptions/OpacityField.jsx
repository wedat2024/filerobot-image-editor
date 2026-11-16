import ThemeScope from 'context/CssTheme';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import restrictNumber from 'utils/restrictNumber';
import Label from 'components/common/Label';

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
          aria-label={t('transparency')}
          annotation="%"
          onChange={changeOpacity}
          value={opacityValue}
          noMargin
        />
        <Label
          className={AnnotationOptionsStyles.iconLabel}
        >{`${opacityValue}%`}</Label>
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
