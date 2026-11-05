/** External Dependencies */
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import FieMenuIconButton from 'components/common/IconButton';
import { usePhoneScreen, useStore } from 'hooks';
import { Menu } from '@scaleflex/icons';
import CloseButton from './CloseButton';
import SaveButton from './SaveButton';
import ResetButton from './ResetButton';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';
import ImageDimensionsAndDisplayToggle from './ImageDimensionsAndDisplayToggle';

import TopbarStyles from './Topbar.module.css';

import BackButton from './BackButton';
import RestoreButton from './RestoreButton';

const defaultToggleMainMenu = () => {};

const Topbar = ({ toggleMainMenu = defaultToggleMainMenu, menuButtonRef }) => {
  const {
    config: { showBackButton, restoreConfig },
    t,
    showTabsMenu,
  } = useStore();

  const isPhoneScreen = usePhoneScreen(320);

  return (
    <div
      className={cx(
        TopbarStyles.topbar,
        isPhoneScreen && TopbarStyles.phone,
        'FIE_topbar',
      )}
    >
      <div
        className={cx(
          TopbarStyles.mainButtonsWrapper,
          'FIE_topbar-buttons-wrapper',
        )}
      >
        <FieMenuIconButton
          ref={menuButtonRef}
          size={isPhoneScreen ? 'sm' : 'lg'}
          color="basic"
          aria-label={t('tabsMenu')}
          aria-expanded={showTabsMenu}
          active={showTabsMenu}
          aria-haspopup="dialog"
          onClick={() => toggleMainMenu(true)}
          className={cx(TopbarStyles.menuIconButton, 'FIE_tabs_toggle_btn')}
        >
          <Menu size={isPhoneScreen ? 14 : 18} />
        </FieMenuIconButton>
        {showBackButton ? <BackButton /> : <SaveButton />}
        <RestoreButton restoreConfig={restoreConfig} />
      </div>

      <div
        className={cx(
          TopbarStyles.flexCenterAlignedContainer,
          'FIE_topbar-center-options',
        )}
      >
        <ImageDimensionsAndDisplayToggle
          showBackButton={showBackButton}
          isPhoneScreen={isPhoneScreen}
        />
      </div>

      <div className={TopbarStyles.controlButtonsWrapper}>
        <div
          className={cx(
            TopbarStyles.historyButtons,
            'FIE_topbar-history-buttons',
          )}
        >
          <ResetButton margin="0" showBackButton={showBackButton} />
          <UndoButton margin="0" showBackButton={showBackButton} />
          <RedoButton margin="0" showBackButton={showBackButton} />
        </div>

        {showBackButton ? <SaveButton /> : <CloseButton />}
      </div>
    </div>
  );
};

Topbar.propTypes = {
  menuButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Object) }),
  toggleMainMenu: PropTypes.func,
};

export default Topbar;
