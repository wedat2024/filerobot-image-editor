import FieHistoryButton from '@scaleflex/ui/core/icon-button';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Reset from '@scaleflex/icons/reset';

/** Internal Dependencies */
import { useStore } from 'hooks';

import TopbarStyles from './Topbar.module.css';

import ConfirmationModal from './ConfirmationModal';

const ResetButton = ({ margin }) => {
  const { isResetted = true, feedback, t } = useStore();

  const isBlockerError = feedback.duration === 0;

  return (
    <ConfirmationModal isReset>
      <FieHistoryButton
        color="basic"
        size="sm"
        disabled={isResetted || isBlockerError}
        title={t('resetOperations')}
        style={{ '--fie-history-margin': margin ?? '0 4px' }}
        className={cx(
          TopbarStyles.historyButton,
          (isResetted || isBlockerError) && TopbarStyles.disabled,
          'FIE_topbar-reset-button',
        )}
      >
        <Reset />
      </FieHistoryButton>
    </ConfirmationModal>
  );
};

ResetButton.defaultProps = {
  margin: undefined,
};

ResetButton.propTypes = {
  margin: PropTypes.string,
};

export default ResetButton;
