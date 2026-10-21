/** External Dependencies */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import ToolsBarStyles from './ToolsBar.module.css';

const ToolsBarItemOptionsWrapper = ({ children, isPhoneScreen }) => (
  <div
    className={cx(
      ToolsBarStyles.toolsBarItemOptionsWrapper,
      Boolean(children) && ToolsBarStyles.hasChildren,
      isPhoneScreen && ToolsBarStyles.phone,
      'FIE_tool-options-wrapper',
    )}
  >
    {children}
  </div>
);

ToolsBarItemOptionsWrapper.defaultProps = {
  children: undefined,
  isPhoneScreen: false,
};

ToolsBarItemOptionsWrapper.propTypes = {
  children: PropTypes.node,
  isPhoneScreen: PropTypes.bool,
};

export default ToolsBarItemOptionsWrapper;
