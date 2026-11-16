/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, Rect, Group } from 'react-konva';

/** Internal Dependencies */
import nodesCommonPropTypes from '../nodesCommonPropTypes';

const defaultBackgroundConfig = {
  fill: 'transparent',
  stroke: 'none',
  strokeWidth: 0,
  cornerRadius: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowColor: 'black',
  shadowOpacity: 0,
  opacity: 1,
};

const TextNode = ({
  id,
  name,
  text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur imperdiet tortor quis odio facilisis, id aliquet nulla facilisis. Etiam tincidunt tempor odio nec placerat.',
  fontFamily = 'Arial',
  fontSize = 14,
  fontStyle,
  fill = '#000',
  x,
  y,
  width = 0,
  height = 0,
  scaleX = nodesCommonPropTypes.defaults.scaleX,
  scaleY = nodesCommonPropTypes.defaults.scaleY,
  rotation = nodesCommonPropTypes.defaults.rotation,
  annotationEvents,
  stroke,
  strokeWidth,
  shadowOffsetX,
  shadowOffsetY,
  shadowBlur,
  shadowColor,
  shadowOpacity,
  opacity = nodesCommonPropTypes.defaults.opacity,
  letterSpacing,
  lineHeight,
  align = 'left',
  backgroundConfig = defaultBackgroundConfig,
  ...otherProps
}) => {
  const textRef = React.useRef(null);

  const textConfig = {
    id,
    name,
    rotation,
    scaleX,
    scaleY,
    stroke,
    strokeWidth,
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowColor,
    shadowOpacity,
    opacity,
    fill,
    text,
    fontFamily,
    fontStyle,
    fontSize,
    letterSpacing,
    lineHeight,
    align,
    x,
    y,
    width,
    height,
  };

  return (
    <Group>
      {/* Background Rectangle */}
      {backgroundConfig && !!Object.keys(backgroundConfig).length && (
        <Rect
          x={x}
          y={y}
          width={width || (textRef.current && textRef.current.width())}
          height={height || (textRef.current && textRef.current.height())}
          fill={backgroundConfig.fill}
          stroke={backgroundConfig.stroke}
          strokeWidth={backgroundConfig.strokeWidth}
          cornerRadius={backgroundConfig.cornerRadius}
          shadowOffsetX={backgroundConfig.shadowOffsetX}
          shadowOffsetY={backgroundConfig.shadowOffsetY}
          shadowBlur={backgroundConfig.shadowBlur}
          shadowColor={backgroundConfig.shadowColor}
          shadowOpacity={backgroundConfig.shadowOpacity}
          opacity={backgroundConfig.opacity}
        />
      )}

      {/* Text Node */}
      <Text
        ref={textRef}
        {...textConfig}
        {...annotationEvents}
        {...otherProps}
      />
    </Group>
  );
};

TextNode.propTypes = {
  ...nodesCommonPropTypes.definitions,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  annotationEvents: PropTypes.instanceOf(Object).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  text: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  fill: PropTypes.string,
  letterSpacing: PropTypes.number,
  lineHeight: PropTypes.number,
  align: PropTypes.string,
  backgroundConfig: PropTypes.shape({
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    cornerRadius: PropTypes.number,
    shadowOffsetX: PropTypes.number,
    shadowOffsetY: PropTypes.number,
    shadowBlur: PropTypes.number,
    shadowColor: PropTypes.string,
    shadowOpacity: PropTypes.number,
    opacity: PropTypes.number,
  }),
};

export default TextNode;
