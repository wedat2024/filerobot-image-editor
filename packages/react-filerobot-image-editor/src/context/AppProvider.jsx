/** External Dependencies */
import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@scaleflex/ui/theme/hooks';

/** Internal Dependencies */
import { useAppReducer } from 'hooks';
import { translate, updateTranslations } from 'utils/translator';
import appReducer from './appReducer';
import AppContext from './AppContext';
import getInitialAppState from './getInitialAppState';

let isFieMounted = true;

const AppProvider = ({ children, config = {} }) => {
  const [state, _dispatch] = useAppReducer(
    appReducer,
    getInitialAppState(config),
    config,
  );

  useEffect(() => {
    isFieMounted = true;

    return () => {
      isFieMounted = false;
    };
  }, []);

  const dispatch = useCallback(
    (...args) => {
      if (isFieMounted) {
        _dispatch(...args);
      }
    },
    [_dispatch],
  );

  useEffect(() => {
    updateTranslations(config.translations, config.language);
  }, [config.useBackendTranslations, config.language, config.translations]);

  const theme = useTheme();
  // Adapt the public theme prop once; CSS Modules do not read the UI palette.
  const themeVariables = useMemo(() => {
    const variables = Object.fromEntries(
      Object.entries(config.theme?.palette || {}).map(([name, value]) => [
        `--fie-${name}`,
        value,
      ]),
    );
    const typography = config.theme?.typography || {};
    if (typography.fontFamily) {
      variables['--fie-font-family'] = typography.fontFamily;
    }
    Object.entries(typography.font || {}).forEach(([variant, properties]) => {
      Object.entries(properties).forEach(([property, value]) => {
        const name = property.replace(
          /[A-Z]/g,
          (letter) => `-${letter.toLowerCase()}`,
        );
        const needsUnit =
          typeof value === 'number' &&
          ['fontSize', 'letterSpacing', 'wordSpacing'].includes(property);
        variables[`--fie-font-${variant}-${name}`] = needsUnit
          ? `${value}px`
          : value;
      });
    });
    return variables;
  }, [config.theme]);
  const providedValue = useMemo(
    () => ({
      ...state,
      config,
      theme,
      themeVariables,
      dispatch,
      t: translate,
    }),
    [config, state, themeVariables],
  );

  return (
    <AppContext.Provider value={providedValue}>{children}</AppContext.Provider>
  );
};

AppProvider.defaultProps = {
  config: {},
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.instanceOf(Object),
};

export default AppProvider;
