import FieDimensionsLabel from '@scaleflex/ui/core/label';
import FieSmallButton from '@scaleflex/ui/core/icon-button';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Compare from '@scaleflex/icons/compare';

/** Internal Dependencies */
import { TOGGLE_ORIGINAL_IMAGE_DISPLAY } from 'actions';
import { useStore } from 'hooks';
import getProperDimensions from 'utils/getProperDimensions';
import Separator from 'components/common/Separator';

import TopbarStyles from './Topbar.module.css';

import CanvasZooming from './CanvasZooming';

const ImageDimensionsAndDisplayToggle = ({ showBackButton, isPhoneScreen }) => {
  const {
    dispatch,
    isResetted = true,
    originalImage,
    resize = {},
    adjustments: { crop, rotation = 0 },
    shownImageDimensions,
    config: { disableZooming },
    t,
  } = useStore();

  const hideOriginalImage = () => {
    dispatch({
      type: TOGGLE_ORIGINAL_IMAGE_DISPLAY,
      payload: {
        isShow: false,
      },
    });

    document.removeEventListener('mouseup', hideOriginalImage);
    document.removeEventListener('mouseleave', hideOriginalImage);
    document.removeEventListener('touchcancel', hideOriginalImage);
    document.removeEventListener('touchend', hideOriginalImage);
  };

  const showOriginalImage = () => {
    dispatch({
      type: TOGGLE_ORIGINAL_IMAGE_DISPLAY,
      payload: {
        isShow: true,
      },
    });

    document.addEventListener('mouseup', hideOriginalImage);
    document.addEventListener('mouseleave', hideOriginalImage);
    document.addEventListener('touchcancel', hideOriginalImage);
    document.addEventListener('touchend', hideOriginalImage);
  };

  if (!originalImage) {
    return null;
  }

  const dimensions = getProperDimensions(
    resize,
    crop,
    shownImageDimensions,
    originalImage,
    rotation,
  );

  return (
    <div
      className={cx(
        TopbarStyles.imageOptionsButtons,
        isPhoneScreen && TopbarStyles.phone,
      )}
    >
      <FieDimensionsLabel
        title={t('imageDimensionsHoverTitle')}
        className={TopbarStyles.dimensionsLabel}
      >
        {`${dimensions.width} x ${dimensions.height} px`}
      </FieDimensionsLabel>

      <div className={TopbarStyles.dimensionsButtons}>
        <FieSmallButton
          color="basic"
          onMouseDown={isResetted ? undefined : showOriginalImage}
          onTouchStart={isResetted ? undefined : showOriginalImage}
          disabled={isResetted}
          title={t('showImageTitle')}
          className={cx(
            TopbarStyles.smallButton,
            showBackButton && TopbarStyles.backButton,
          )}
        >
          <Compare />
        </FieSmallButton>
        {!disableZooming && (
          <>
            <Separator />
            <CanvasZooming showBackButton={showBackButton} />
          </>
        )}
      </div>
    </div>
  );
};

ImageDimensionsAndDisplayToggle.defaultProps = {
  showBackButton: false,
  isPhoneScreen: false,
};

ImageDimensionsAndDisplayToggle.propTypes = {
  showBackButton: PropTypes.bool,
  isPhoneScreen: PropTypes.bool,
};

export default ImageDimensionsAndDisplayToggle;
