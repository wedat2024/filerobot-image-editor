/** External Dependencies */
import { useStore } from 'hooks';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import restrictNumber from 'utils/restrictNumber';
import ColorInput from 'components/common/ColorInput';

import AnnotationOptionsStyles from './AnnotationOptions.module.css';

import Slider from '../Slider';

const MIN_PERCENTANGE = 0;
const MAX_PERCENTANGE = 100;

const StrokeFields = ({
  annotation,
  updateAnnotation,
  showStroke = true,
  isPhone = false,
}) => {
  const { t } = useStore();

  const { stroke, strokeWidth } = annotation;

  const changeStrokeWidth = (newStrokeWidth) => {
    updateAnnotation({
      strokeWidth: restrictNumber(
        newStrokeWidth,
        MIN_PERCENTANGE,
        MAX_PERCENTANGE,
      ),
    });
  };

  const changeStrokeColor = (newStrokeColor) => {
    updateAnnotation({ stroke: newStrokeColor });
  };

  return (
    <div className={AnnotationOptionsStyles.spacedOptionFields}>
      <Slider
        aria-label={t('stroke')}
        annotation="px"
        onChange={changeStrokeWidth}
        value={strokeWidth}
        noMargin
      />
      {showStroke && isPhone && (
        <ColorInput
          color={stroke}
          onChange={changeStrokeColor}
          colorFor="stroke"
        />
      )}
    </div>
  );
};

StrokeFields.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  showStroke: PropTypes.bool,
  isPhone: PropTypes.bool,
};

export default StrokeFields;
