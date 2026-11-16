import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import ThemeScope from 'context/CssTheme';
import Popover from 'components/common/Popover';
import ThumbnailButton from 'ui/ThumbnailButton';

import styles from './Image.module.css';

const defaultGallery = [];

const ImagesGallery = ({
  gallery = defaultGallery,
  anchorEl = null,
  onClose,
  onSelect,
}) => {
  const { t } = useStore();

  if (!anchorEl) return <div aria-hidden="true" />;

  return (
    <Popover
      className="FIE_image-tool-gallery"
      anchor={anchorEl}
      position="top"
      onClose={onClose}
      surface="div"
      aria-label={t('fromGallery')}
    >
      <ThemeScope className={styles.gallery}>
        {gallery.map(({ originalUrl, previewUrl }, index) => (
          <ThumbnailButton
            key={originalUrl}
            src={previewUrl}
            label={`${t('imageTool')} ${index + 1}`}
            onClick={() => onSelect(originalUrl)}
          />
        ))}
      </ThemeScope>
    </Popover>
  );
};

ImagesGallery.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  gallery: PropTypes.arrayOf(Object),
  anchorEl: PropTypes.instanceOf(Object),
};

export default ImagesGallery;
