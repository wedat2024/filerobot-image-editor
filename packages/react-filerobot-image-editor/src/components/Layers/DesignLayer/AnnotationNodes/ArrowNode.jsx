/** External Dependencies */
import PropTypes from 'prop-types';
import { Arrow } from 'react-konva';

/** Internal Dependencies */
import nodesCommonPropTypes from '../nodesCommonPropTypes';

const ArrowNode = ({
  id,
  name,
  fill,
  pointerLength,
  pointerWidth,
  scaleX = nodesCommonPropTypes.defaults.scaleX,
  scaleY = nodesCommonPropTypes.defaults.scaleY,
  rotation = nodesCommonPropTypes.defaults.rotation,
  annotationEvents,
  points,
  lineCap = 'butt',
  stroke = '#000000',
  strokeWidth = 6,
  shadowOffsetX,
  shadowOffsetY,
  shadowBlur,
  shadowColor,
  shadowOpacity,
  opacity = nodesCommonPropTypes.defaults.opacity,
  ...otherProps
}) => (
  <Arrow
    id={id}
    name={name}
    rotation={rotation}
    scaleX={scaleX}
    scaleY={scaleY}
    stroke={stroke}
    strokeWidth={strokeWidth}
    shadowOffsetX={shadowOffsetX}
    shadowOffsetY={shadowOffsetY}
    shadowBlur={shadowBlur}
    shadowColor={shadowColor}
    shadowOpacity={shadowOpacity}
    fill={fill}
    x={0}
    y={0}
    points={points}
    pointerLength={pointerLength}
    pointerWidth={pointerWidth}
    lineCap={lineCap}
    opacity={opacity}
    {...annotationEvents}
    {...otherProps}
  />
);

ArrowNode.propTypes = {
  ...nodesCommonPropTypes.definitions,
  points: PropTypes.instanceOf(Array).isRequired,
  annotationEvents: PropTypes.instanceOf(Object).isRequired,
  pointerLength: PropTypes.number,
  pointerWidth: PropTypes.number,
  fill: PropTypes.string,
  lineCap: PropTypes.string,
};

export default ArrowNode;
