/** External Dependencies */
import React, { memo } from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import App from 'components/App';
import { AppProvider } from 'context';
import defaultConfig from 'context/defaultConfig';
import deepMerge from 'utils/deepMerge';

import './globalStyles.module.css';

const defaultCloudimage = {};

const AssemblyPoint = ({
  useCloudimage = false,
  cloudimage = defaultCloudimage,
  ...props
}) => {
  const { img, source } = props;

  // TODO: Remove this property from here after PROD. release
  if (img) {
    throw new Error(
      '`img` is renamed to `source` please consider renaming it from your configurations.',
    );
  }

  if (
    !source ||
    (typeof source !== 'string' && !(source instanceof HTMLImageElement))
  ) {
    throw new Error(
      '`source` property is required either a string of image url or a HTMLImageElement for the image that will be edited.',
    );
  }

  if (useCloudimage) {
    if (cloudimage?.imageSealing?.enable && !cloudimage?.imageSealing?.salt) {
      throw new Error(
        '`salt` property of imageSealing object is required in cloudimage mode as long as `imageSealing` is enabled.',
      );
    }
  }

  const defaultAndProvidedConfigMerged = deepMerge(defaultConfig, {
    ...props,
    useCloudimage,
    cloudimage,
  });

  return (
    <React.StrictMode>
      <AppProvider config={defaultAndProvidedConfigMerged}>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
};

AssemblyPoint.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(HTMLImageElement),
    PropTypes.instanceOf(SVGImageElement),
    PropTypes.instanceOf(ImageBitmap),
  ]).isRequired,
  // TODO: Remove this property from here after PROD. release
  img: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(HTMLImageElement),
    PropTypes.instanceOf(SVGImageElement),
    PropTypes.instanceOf(ImageBitmap),
  ]),
  useCloudimage: PropTypes.bool,
  cloudimage: PropTypes.instanceOf(Object),
};

export default memo(AssemblyPoint);
