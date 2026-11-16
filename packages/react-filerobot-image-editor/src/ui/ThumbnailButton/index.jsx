import React from 'react';
import PropTypes from 'prop-types';

import styles from './ThumbnailButton.module.css';

const ThumbnailButton = ({ src, label, onClick }) => (
  <button
    type="button"
    className={styles.thumbnail}
    aria-label={label}
    onClick={onClick}
  >
    <img src={src} alt="" crossOrigin="Anonymous" draggable={false} />
  </button>
);

ThumbnailButton.propTypes = {
  src: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ThumbnailButton;
