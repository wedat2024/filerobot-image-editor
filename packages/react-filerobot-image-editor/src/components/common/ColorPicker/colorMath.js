// These conversions retain the editor's integer HSL/HSV rounding contract.
export const transparent = 'rgba(0,0,0,0)';
export const transparentHex = '#00000000';
export const isTransparent = (color) =>
  color === transparent || color === transparentHex;
export const validHex = (color) => /^#[\da-f]{6}$/i.test(color);
export const channels = (color) =>
  [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16));
export const rgbHex = (rgb) =>
  `#${rgb.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
export const rgbText = (color) =>
  isTransparent(color) ? transparent : `rgb(${channels(color).join(', ')})`;

export const initialHex = (color = '') => {
  if (isTransparent(color)) return transparentHex;
  if (color.startsWith('#'))
    return color.length === 7
      ? color
      : `#${[...color.slice(0, 3)].map((char) => char + char).join('')}`;
  if (color.startsWith('rgb'))
    return rgbHex(
      color
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number),
    );
  return '#000000';
};

export const toHsl = (color) => {
  const [red, green, blue] = channels(color).map((value) => value / 255);
  const high = Math.max(red, green, blue);
  const low = Math.min(red, green, blue);
  const delta = high - low;
  const lightness = (high + low) / 2;
  let hue = 0;
  let saturation = 0;

  if (delta) {
    saturation = delta / (lightness > 0.5 ? 2 - high - low : high + low);
    if (high === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
    else if (high === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }

  return [
    Math.round(hue * 60),
    Math.round(saturation * 100),
    Math.round(lightness * 100),
  ];
};

export const colorPosition = (color) => {
  const [hue, saturation, lightness] = toHsl(color);
  const chroma = (saturation / 100) * (1 - Math.abs((2 * lightness) / 100 - 1));
  const value = lightness / 100 + chroma / 2;

  return {
    hue,
    saturation: value ? Math.round((chroma / value) * 100) : 0,
    value: Math.round(value * 100),
  };
};

export const positionHex = (hue, saturation, value) => {
  const lightness = value * (1 - saturation / 2);
  const hslSaturation =
    lightness === 0 || lightness === 1
      ? 0
      : (value - lightness) / Math.min(lightness, 1 - lightness);
  const roundedLightness = Math.round(lightness * 100) / 100;
  const amplitude =
    (Math.round(hslSaturation * 100) / 100) *
    Math.min(roundedLightness, 1 - roundedLightness);
  const rgb = [0, 8, 4].map((offset) => {
    const phase = (offset + hue / 30) % 12;
    return Math.round(
      255 *
        (roundedLightness -
          amplitude * Math.max(-1, Math.min(phase - 3, 9 - phase, 1))),
    );
  });

  return rgbHex(rgb);
};
