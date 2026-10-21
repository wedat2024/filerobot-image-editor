/** External Dependencies */
import React from 'react';
import { Button } from '@scaleflex/ui/core';
import ArrowLeftOutline from '@scaleflex/icons/arrow-left-outline';

/** Internal Dependencies */
import { usePhoneScreen, useStore } from 'hooks';
import TopbarStyles from './Topbar.module.css';
import ConfirmationModal from './ConfirmationModal';

const BackButton = () => {
  const { t } = useStore();
  const isPhone = usePhoneScreen();

  return (
    <ConfirmationModal>
      <Button
        className="FIE_topbar-back-button"
        color="link-secondary"
        size="sm"
        startIcon={<ArrowLeftOutline />}
      >
        {!isPhone && (
          <span className={TopbarStyles.backButtonLabel}>{t('back')}</span>
        )}
      </Button>
    </ConfirmationModal>
  );
};

export default BackButton;
