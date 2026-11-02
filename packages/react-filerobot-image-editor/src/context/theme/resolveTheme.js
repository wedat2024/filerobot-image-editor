import defaultTheme from './defaultTheme';

// Legacy typography/shape overrides merge into shared nested defaults. Keep that
// behavior during this migration, including Custom -> Default transitions.
const mergeNested = (target, override) => {
  Object.entries(override || {}).forEach(([key, value]) => {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) return;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const previous = target[key];
      const nested = previous && typeof previous === 'object' ? previous : {};

      Object.assign(target, { [key]: mergeNested(nested, value) });
    } else if (value !== undefined) {
      Object.assign(target, { [key]: value });
    }
  });

  return target;
};

const resolveTheme = ({ palette, typography, shape, shadows } = {}) => ({
  palette: { ...defaultTheme.palette, ...palette },
  typography: mergeNested({ ...defaultTheme.typography }, typography),
  shape: mergeNested({ ...defaultTheme.shape }, shape),
  shadows: { ...defaultTheme.shadows, ...shadows },
});

export default resolveTheme;
