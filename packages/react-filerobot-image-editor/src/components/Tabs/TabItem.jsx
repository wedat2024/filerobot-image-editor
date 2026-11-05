/** External Dependencies */
import { useCallback, memo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import FieTabItemLabel from 'components/common/Label';
import TabsStyles from './Tabs.module.css';

const TabItem = ({ id, label, Icon, isSelected = false, onClick }) => {
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick(id);
    }
  }, [id]);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={handleClick}
      className={cx(TabsStyles.tabItem, 'FIE_tab')}
    >
      <Icon size={24} />
      {label && (
        <FieTabItemLabel
          className={cx(TabsStyles.tabItemLabel, 'FIE_tab-label')}
        >
          {label}
        </FieTabItemLabel>
      )}
    </button>
  );
};

TabItem.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  Icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.instanceOf(Object),
  ]).isRequired,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

export default memo(TabItem);
