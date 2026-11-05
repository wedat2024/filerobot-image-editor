/** External Dependencies */
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import FieRestoreButton from 'components/common/Button';
import { useStore } from 'hooks';

import TopbarStyles from './Topbar.module.css';

const defaultRestoreConfig = {
  showRestore: false,
  onClick: undefined,
};

const RestoreButton = ({ restoreConfig = defaultRestoreConfig }) => {
  const state = useStore();

  const { t } = state;

  return restoreConfig.showRestore ? (
    <div
      className={cx(
        TopbarStyles.restoreButtonWrapper,
        'FIE_topbar-restore-wrapper',
      )}
    >
      <FieRestoreButton
        color="secondary"
        size="md"
        onClick={restoreConfig?.onClick}
        className={cx(TopbarStyles.restoreButton, 'FIE_topbar-restore-wrapper')}
      >
        {t('restore')}
      </FieRestoreButton>
    </div>
  ) : null;
};

RestoreButton.propTypes = {
  restoreConfig: PropTypes.shape({
    showRestore: PropTypes.bool,
    onClick: PropTypes.func,
  }),
};

export default RestoreButton;
