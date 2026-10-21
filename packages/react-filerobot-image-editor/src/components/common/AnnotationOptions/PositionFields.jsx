/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve existing click behavior during CSS migration. */
/** External Dependencies */
import React, { Fragment, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { ArrowRight, Point } from '@scaleflex/icons';

/** Internal Dependencies */
import { POSITIONS } from 'utils/constants';
import mapPositionStringToPoint from 'utils/mapPositionStringToPoint';
import { useStore } from 'hooks';

import AnnotationOptionsStyles from './AnnotationOptions.module.css';

import {
  AVAILABLE_POSITIONS,
  posCssRotateDegFromRightSide,
} from './AnnotationOptions.constants';

const PositionFields = ({ annotation, updateAnnotation }) => {
  const [position, setPosition] = useState(null);

  const { designLayer } = useStore();

  const changePosition = (newPositionStr) => {
    updateAnnotation(
      mapPositionStringToPoint(annotation, designLayer, newPositionStr),
    );
    setPosition(newPositionStr);
  };

  const positionsLength = AVAILABLE_POSITIONS.length;

  return AVAILABLE_POSITIONS.map((pos, i) => (
    <Fragment key={pos}>
      <div
        onClick={() => changePosition(pos)}
        className={cx(
          AnnotationOptionsStyles.iconWrapper,
          AnnotationOptionsStyles.thinBorder,
          AnnotationOptionsStyles.secondaryIcon,
          position === pos && AnnotationOptionsStyles.active,
        )}
      >
        {pos === POSITIONS.MIDDLE_CENTER ? (
          <Point />
        ) : (
          <ArrowRight
            style={{
              transform: `rotate(${posCssRotateDegFromRightSide[pos]}deg)`,
            }}
          />
        )}
      </div>
      {(i + 1) % 3 === 0 && i + 1 !== positionsLength && <div />}
    </Fragment>
  ));
};

PositionFields.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
};

export default PositionFields;
