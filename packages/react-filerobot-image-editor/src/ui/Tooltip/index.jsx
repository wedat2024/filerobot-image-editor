import PropTypes from 'prop-types';
import cx from 'classnames';

import './tippy.css';
import styles from './Tooltip.module.css';

const TooltipContent = ({ children, style }) => (
  <div style={style} className={cx(styles.content, 'SfxTooltipV2-content')}>
    {children}
  </div>
);

TooltipContent.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.instanceOf(Object),
};

export const tooltipClassName = cx(styles.tooltip, 'SfxTooltipV2-root');
export default TooltipContent;
