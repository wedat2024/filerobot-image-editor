/** External Dependencies */
import PropTypes from 'prop-types';
import { RegularPolygon } from 'react-konva';

/** Internal Dependencies */
import nodesCommonPropTypes from '../nodesCommonPropTypes';

const PolygonNode = ({
  id,
  name,
  fill = '#000',
  x,
  y,
  radius,
  scaleX = nodesCommonPropTypes.defaults.scaleX,
  scaleY = nodesCommonPropTypes.defaults.scaleY,
  rotation = nodesCommonPropTypes.defaults.rotation,
  sides = 3,
  annotationEvents,
  stroke,
  strokeWidth,
  shadowOffsetX,
  shadowOffsetY,
  shadowBlur,
  shadowColor,
  shadowOpacity,
  opacity = nodesCommonPropTypes.defaults.opacity,
  ...otherProps
}) => (
  <RegularPolygon
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
    x={x}
    y={y}
    radius={radius}
    offsetX={-radius}
    offsetY={-radius}
    sides={sides}
    opacity={opacity}
    {...annotationEvents}
    {...otherProps}
  />
);

PolygonNode.propTypes = {
  ...nodesCommonPropTypes.definitions,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  annotationEvents: PropTypes.instanceOf(Object).isRequired,
  radius: PropTypes.number.isRequired,
  fill: PropTypes.string,
  sides: PropTypes.number,
};

export default PolygonNode;
