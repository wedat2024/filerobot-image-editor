/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve existing click behavior during CSS migration. */
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import AnnotationOptionsStyles from 'components/common/AnnotationOptions/AnnotationOptions.module.css';

import { TextAlignCenter, TextAlignLeft } from '@scaleflex/icons';

const rightAlignmentCssTransform = { transform: 'scaleX(-1)' };

const TextAlignmentFields = ({
  annotation: text,
  updateAnnotation: updateText,
}) => {
  const { align } = text;

  const changeHorizontalAlignment = (newHorizonalAlignment) => {
    updateText({ align: newHorizonalAlignment });
  };

  return (
    <div className={AnnotationOptionsStyles.spacedOptionFields}>
      <div
        onClick={() => changeHorizontalAlignment('left')}
        className={cx(
          AnnotationOptionsStyles.iconWrapper,
          align === 'left' && AnnotationOptionsStyles.active,
        )}
      >
        <TextAlignLeft />
      </div>
      <div
        onClick={() => changeHorizontalAlignment('center')}
        className={cx(
          AnnotationOptionsStyles.iconWrapper,
          align === 'center' && AnnotationOptionsStyles.active,
        )}
      >
        <TextAlignCenter />
      </div>
      <div
        onClick={() => changeHorizontalAlignment('right')}
        className={cx(
          AnnotationOptionsStyles.iconWrapper,
          align === 'right' && AnnotationOptionsStyles.active,
        )}
      >
        <TextAlignLeft style={rightAlignmentCssTransform} />
      </div>
    </div>
  );
};

TextAlignmentFields.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
};

export default TextAlignmentFields;
