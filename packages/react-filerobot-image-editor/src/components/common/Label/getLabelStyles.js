// Keep existing CSS overrides for core typography; forward every other font style.
const getLabelStyles = ({ font, palette, error, disabled, style }) => {
  const {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    lineHeight,
    color,
    ...additionalStyles
  } = font;

  return {
    ...additionalStyles,
    '--fie-label-color': error
      ? palette.error
      : color ?? palette[disabled ? 'btn-disabled-text' : 'txt-secondary'],
    '--fie-label-error-color': palette.error,
    '--fie-label-font-family': fontFamily,
    '--fie-label-font-size':
      typeof fontSize === 'number' ? String(fontSize) + 'px' : fontSize,
    '--fie-label-font-weight': fontWeight,
    '--fie-label-font-style': fontStyle,
    '--fie-label-line-height': lineHeight,
    ...style,
  };
};

export default getLabelStyles;
