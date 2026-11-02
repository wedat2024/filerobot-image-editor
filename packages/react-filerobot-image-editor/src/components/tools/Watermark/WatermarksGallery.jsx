/** External Dependencies */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import { TOOLS_IDS, WATERMARK_ANNOTATION_ID } from 'utils/constants';
import Carousel from 'components/common/Carousel';
import { SET_FEEDBACK } from 'actions';

import styles from './Watermark.module.css';

const WatermarksGallery = ({
  addImgWatermark,
  loadAndSetWatermarkImg,
  style,
}) => {
  const { config, annotations, dispatch, t } = useStore();

  const currentWatermarkUrl = useMemo(
    () => (annotations[WATERMARK_ANNOTATION_ID] || {}).image?.src,
    [annotations[WATERMARK_ANNOTATION_ID]],
  );

  const getWatermarkImgAndSelect = (e) => {
    const watermarkImgEl = e.currentTarget.children[0];

    if (watermarkImgEl.complete) {
      if (!watermarkImgEl.naturalWidth) {
        dispatch({
          type: SET_FEEDBACK,
          payload: {
            feedback: {
              message: t('mutualizedFailedToLoadImg'),
              duration: 2000,
            },
          },
        });

        return;
      }

      addImgWatermark(watermarkImgEl);
    }
  };

  const { gallery = [] } = config[TOOLS_IDS.WATERMARK] || {};

  if (gallery.length === 0) {
    return null;
  }

  return (
    <Carousel className="FIE_watermark-gallery" style={style}>
      {gallery.map((watermark) => {
        const watermarkUrl = watermark?.url || watermark;
        const previewUrl = watermark?.previewUrl || watermarkUrl;
        const isSameUrl = watermarkUrl === previewUrl;

        return (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve the existing div/click behavior during the CSS migration.
          <div
            className={`${styles.galleryItem} FIE_watermark-selected-item`}
            onClick={(e) =>
              isSameUrl
                ? getWatermarkImgAndSelect(e)
                : loadAndSetWatermarkImg(watermarkUrl)
            }
            key={watermarkUrl}
            aria-selected={watermarkUrl === currentWatermarkUrl}
          >
            <img
              src={previewUrl}
              alt="Failed to load."
              crossOrigin="Anonymous"
              draggable={false}
            />
          </div>
        );
      })}
    </Carousel>
  );
};

WatermarksGallery.defaultProps = {
  style: undefined,
};

WatermarksGallery.propTypes = {
  addImgWatermark: PropTypes.func.isRequired,
  loadAndSetWatermarkImg: PropTypes.func.isRequired,
  style: PropTypes.instanceOf(Object),
};

export default WatermarksGallery;
