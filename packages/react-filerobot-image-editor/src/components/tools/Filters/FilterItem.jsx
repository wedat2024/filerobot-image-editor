/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve existing click behavior during CSS migration. */

import FieFilterItemLabel from '@scaleflex/ui/core/label';
/** External Dependencies */
import React, { memo, useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Layer, Image, Stage as FieFilterItemPreview } from 'react-konva';

/** Internal Dependencies */
import FiltersStyles from './Filters.module.css';

const MAX_FILTER_PREVIEW_WIDTH = 60;
const MAX_FILTER_PREVIEW_HEIGHT = 45;

const FilterItem = ({
  filterLabel,
  filterFn,
  applyFilter,
  isActive,
  image,
}) => {
  const imageNodeRef = useRef();
  const handleFilterApplying = useCallback(() => {
    applyFilter(filterFn);
  }, [filterFn]);

  const cacheImageNode = useCallback(() => {
    if (imageNodeRef.current) {
      imageNodeRef.current.cache();
    } else {
      setTimeout(cacheImageNode, 0);
    }
  }, []);

  useEffect(() => {
    if (image) {
      cacheImageNode();
    }

    return () => {
      imageNodeRef.current?.clearCache();
    };
  }, [image]);

  const imgRatio = image.width / image.height;
  const isVerticalImg = imgRatio < 1;
  const filterImgPreviewWidth = isVerticalImg
    ? MAX_FILTER_PREVIEW_WIDTH
    : MAX_FILTER_PREVIEW_HEIGHT * imgRatio;
  const filterImgPreviewHeight = isVerticalImg
    ? MAX_FILTER_PREVIEW_WIDTH / imgRatio
    : MAX_FILTER_PREVIEW_HEIGHT;

  return (
    <div
      onClick={handleFilterApplying}
      aria-selected={isActive}
      className={cx(FiltersStyles.filterItem, 'FIE_filters-item')}
    >
      <FieFilterItemPreview
        width={MAX_FILTER_PREVIEW_WIDTH}
        height={MAX_FILTER_PREVIEW_HEIGHT}
        className={cx(
          FiltersStyles.filterItemPreview,
          'FIE_filters-item-preview',
        )}
      >
        <Layer onTap={handleFilterApplying}>
          <Image
            image={image}
            filters={filterFn ? [filterFn] : []}
            width={filterImgPreviewWidth}
            height={filterImgPreviewHeight}
            x={-(filterImgPreviewWidth - MAX_FILTER_PREVIEW_WIDTH) / 2}
            y={-(filterImgPreviewHeight - MAX_FILTER_PREVIEW_HEIGHT) / 2}
            ref={imageNodeRef}
          />
        </Layer>
      </FieFilterItemPreview>
      <FieFilterItemLabel
        className={cx(FiltersStyles.filterItemLabel, 'FIE_filters-item-label')}
      >
        {filterLabel}
      </FieFilterItemLabel>
    </div>
  );
};

FilterItem.defaultProps = {
  filterFn: undefined,
};

FilterItem.propTypes = {
  image: PropTypes.instanceOf(HTMLImageElement).isRequired,
  filterLabel: PropTypes.string.isRequired,
  filterFn: PropTypes.func,
  applyFilter: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default memo(FilterItem);
