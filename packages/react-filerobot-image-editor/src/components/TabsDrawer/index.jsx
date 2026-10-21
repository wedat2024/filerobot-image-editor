import { Drawer as FieDrawer, Button } from '@scaleflex/ui/core';
/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {
  DrawerBody,
  DrawerHeader,
  DrawerList,
} from '@scaleflex/ui/core/drawer';
import { Menu } from '@scaleflex/icons';

/** Internal Dependencies */
import { useStore } from 'hooks';
import AppStyles from 'components/App/App.module.css';
import Tabs from 'components/Tabs';

const TabsDrawer = ({ toggleMainMenu }) => {
  const { t, showTabsMenu } = useStore();

  return (
    <FieDrawer
      open={showTabsMenu}
      onClose={() => toggleMainMenu(false)}
      disablePortal
      className={cx(AppStyles.drawer, 'FIE_tabs-drawer')}
    >
      <DrawerHeader>
        <Button
          color="link-basic-secondary"
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
  toggleMainMenu: () => {},
};

TabsDrawer.propTypes = {
  toggleMainMenu: PropTypes.func,
};

export default TabsDrawer;
