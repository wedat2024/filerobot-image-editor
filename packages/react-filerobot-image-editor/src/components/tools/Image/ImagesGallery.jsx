/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import Popper from '@scaleflex/ui/core/popper';

/** Internal Dependencies */
import ThemeScope from 'context/CssTheme';
import styles from './Image.module.css';

const ImagesGallery = ({ gallery, anchorEl, onClose, onSelect }) => {
  return (
    <Popper
      className="FIE_image-tool-gallery"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      position="top"
      onClick={onClose}
      overlay
    >
      <ThemeScope className={styles.gallery}>
        {gallery.map(({ originalUrl, previewUrl }) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve the existing div/click behavior during the CSS migration.
          <div
            className={styles.imageWrapper}
            key={originalUrl}
            onClick={() => onSelect(originalUrl)}
          >
            <img
              src={previewUrl}
              alt={previewUrl}
              crossOrigin="Anonymous"
              draggable={false}
            />
          </div>
        ))}
      </ThemeScope>
    </Popper>
  );
};
ImagesGallery.defaultProps = {
  gallery: [],
  anchorEl: null,
};

ImagesGallery.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  gallery: PropTypes.arrayOf(Object),
  anchorEl: PropTypes.instanceOf(Object),
};

export default ImagesGallery;
