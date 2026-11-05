/** External Dependencies */
import PropTypes from 'prop-types';

/** Internal Dependencies */
import styles from './Separator.module.css';

const Separator = ({ height = '24px', width = '1px' }) => {
  return (
    <div
      className={styles.separator}
      style={{
        '--fie-separator-height': height,
        '--fie-separator-width': width,
      }}
    />
  );
};

Separator.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
};

export default Separator;
