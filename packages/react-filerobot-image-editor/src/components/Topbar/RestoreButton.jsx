/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import {
  StyledRestoreButton,
  StyledRestoreButtonWrapper,
} from './Topbar.styled';

const RestoreButton = ({ restoreConfig }) => {
  const state = useStore();
  const { t } = state;

  return restoreConfig.showRestore ? (
    <StyledRestoreButtonWrapper className="FIE_topbar-restore-wrapper">
      <StyledRestoreButton
        className="FIE_topbar-restore-wrapper"
        onClick={restoreConfig?.onClick}
      >
        {t('restore')}
      </StyledRestoreButton>
    </StyledRestoreButtonWrapper>
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
