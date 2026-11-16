/** External Dependencies */
import React from 'react';
import cx from 'classnames';

/** Internal Dependencies */
import FieCloseButton from 'components/common/CrossButton';
import { useStore } from 'hooks';
import Separator from 'components/common/Separator';

import TopbarStyles from './Topbar.module.css';

import ConfirmationModal from './ConfirmationModal';

const CloseButton = () => {
  const {
    config: { onClose },
    t,
  } = useStore();

  if (typeof onClose !== 'function') {
    return null;
  }

  return (
    <>
      <Separator />
      <ConfirmationModal>
        <FieCloseButton
          aria-label={t('close')}
          className={cx(TopbarStyles.closeButton, 'FIE_topbar-close-button')}
        />
      </ConfirmationModal>
    </>
  );
};

export default CloseButton;
