/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import { StyledRestoreButton } from './Topbar.styled';

const RestoreButton = ({ restoreConfig }) => {
  const state = useStore();
  const { t } = state;

  return (
    <StyledRestoreButton
      className="FIE_topbar-save"
      color="primary"
      onClick={restoreConfig?.onClick}
      disabled={!restoreConfig?.showRestore}
    >
      {t('restore')}
    </StyledRestoreButton>
  );
};

RestoreButton.defaultProps = {
  restoreConfig: {
    showRestore: false,
    onClick: undefined,
  },
};

RestoreButton.propTypes = {
  restoreConfig: PropTypes.objectOf({
    showRestore: PropTypes.bool,
    onClick: PropTypes.func,
  }),
};

export default RestoreButton;
