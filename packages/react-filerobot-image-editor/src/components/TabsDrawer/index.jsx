/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Menu } from '@scaleflex/icons';

/** Internal Dependencies */
import { DrawerBody, DrawerHeader, DrawerList } from 'ui/Drawer';
import FieDrawer from 'components/common/Drawer';
import Button from 'components/common/Button';
import { useStore } from 'hooks';

import AppStyles from 'components/App/App.module.css';

import Tabs from 'components/Tabs';

const TabsDrawer = ({ toggleMainMenu, menuButtonRef }) => {
  const { t, showTabsMenu } = useStore();

  return (
    <FieDrawer
      open={showTabsMenu}
      returnFocusRef={menuButtonRef}
      onClose={() => toggleMainMenu(false)}
      aria-label={t('tabsMenu')}
      className={cx(AppStyles.drawer, 'FIE_tabs-drawer')}
    >
      <DrawerHeader>
        <Button
          color="link-basic-secondary"
          size="md"
          startIcon={<Menu />}
          onClick={() => toggleMainMenu(false)}
        >
          {t('tabsMenu')}
        </Button>
      </DrawerHeader>
      <DrawerBody>
        <DrawerList>
          <Tabs toggleMainMenu={toggleMainMenu} isDrawer />
        </DrawerList>
      </DrawerBody>
    </FieDrawer>
  );
};

TabsDrawer.defaultProps = {
  menuButtonRef: undefined,
  toggleMainMenu: () => {},
};

TabsDrawer.propTypes = {
  menuButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Object) }),
  toggleMainMenu: PropTypes.func,
};

export default TabsDrawer;
