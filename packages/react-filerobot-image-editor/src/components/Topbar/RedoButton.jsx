import FieHistoryButton from '@scaleflex/ui/core/icon-button';
/** External Dependencies */
import React, { useCallback } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Redo from '@scaleflex/icons/redo';

/** Internal Dependencies */
import { REDO } from 'actions';
import { useStore } from 'hooks';

import TopbarStyles from './Topbar.module.css';

const RedoButton = ({ margin }) => {
  const { dispatch, hasRedo = false, t } = useStore();

  const dispatchRedo = useCallback(() => {
    dispatch({ type: REDO });
  }, []);

  return (
    <FieHistoryButton
      color="basic"
      size="sm"
      onClick={hasRedo ? dispatchRedo : undefined}
      disabled={!hasRedo}
      title={t('redoTitle')}
      style={{ '--fie-history-margin': margin ?? '0 4px' }}
      className={cx(
        TopbarStyles.historyButton,
        !hasRedo && TopbarStyles.disabled,
        'FIE_topbar-redo-button',
      )}
    >
      <Redo />
    </FieHistoryButton>
  );
};

RedoButton.defaultProps = {
  margin: undefined,
};

RedoButton.propTypes = {
  margin: PropTypes.string,
};

export default RedoButton;
