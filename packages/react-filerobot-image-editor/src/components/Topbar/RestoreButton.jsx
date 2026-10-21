import FieRestoreButton from '@scaleflex/ui/core/button';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';

import TopbarStyles from './Topbar.module.css';

const RestoreButton = ({ restoreConfig }) => {
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
        onClick={restoreConfig?.onClick}
        className={cx(TopbarStyles.restoreButton, 'FIE_topbar-restore-wrapper')}
      >
        {t('restore')}
      </FieRestoreButton>
    </div>
  ) : null;
};

RestoreButton.defaultProps = {
  restoreConfig: {
    showRestore: false,
    onClick: undefined,
  },
};

RestoreButton.propTypes = {
  restoreConfig: PropTypes.shape({
    showRestore: PropTypes.bool,
    onClick: PropTypes.func,
  }),
};

export default RestoreButton;
