import { CrossButton as FieCloseButton } from '@scaleflex/ui/core';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import CrossOutline from '@scaleflex/icons/cross-outline';

/** Internal Dependencies */
import { useStore } from 'hooks';
import Separator from 'components/common/Separator';

import TopbarStyles from './Topbar.module.css';

import ConfirmationModal from './ConfirmationModal';

const CloseButton = () => {
  const {
    config: { onClose },
  } = useStore();

  if (typeof onClose !== 'function') {
    return null;
  }

  return (
    <>
      <Separator />
      <ConfirmationModal>
        <FieCloseButton
          color="basic"
          size="md"
          className={cx(TopbarStyles.closeButton, 'FIE_topbar-close-button')}
        >
          <CrossOutline />
        </FieCloseButton>
      </ConfirmationModal>
    </>
  );
};

export default CloseButton;
