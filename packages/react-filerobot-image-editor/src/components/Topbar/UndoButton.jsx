import FieHistoryButton from '@scaleflex/ui/core/icon-button';
/** External Dependencies */
import React, { useCallback } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Undo from '@scaleflex/icons/undo';

/** Internal Dependencies */
import { UNDO } from 'actions';
import { useStore } from 'hooks';

import TopbarStyles from './Topbar.module.css';

const UndoButton = ({ margin }) => {
  const { dispatch, hasUndo = false, t, feedback } = useStore();

  const isBlockerError = feedback.duration === 0;

  const dispatchUndo = useCallback(() => {
    dispatch({ type: UNDO });
  }, []);

  return (
    <FieHistoryButton
      color="basic"
      size="sm"
      onClick={hasUndo ? dispatchUndo : undefined}
      disabled={!hasUndo || isBlockerError}
      title={t('undoTitle')}
      style={{ '--fie-history-margin': margin ?? '0 4px' }}
      className={cx(
        TopbarStyles.historyButton,
        (!hasUndo || isBlockerError) && TopbarStyles.disabled,
        'FIE_topbar-undo-button',
      )}
    >
      <Undo />
    </FieHistoryButton>
  );
};

UndoButton.defaultProps = {
  margin: undefined,
};

UndoButton.propTypes = {
  margin: PropTypes.string,
};

export default UndoButton;
