import PropTypes from 'prop-types';
import cx from 'classnames';
import ArrowBottom from '@scaleflex/icons/arrow-bottom';

import styles from './Accordion.module.css';

const Accordion = ({
  id,
  label,
  expanded = false,
  onChange,
  children,
  className,
  style,
}) => (
  <div className={cx('SfxAccordion-root', className)} style={style}>
    <button
      type="button"
      id={`${id}-header`}
      className={cx(styles.header, 'SfxAccordionHeader-root')}
      aria-expanded={expanded}
      aria-controls={expanded ? id : undefined}
      onClick={onChange}
    >
      <span className="SfxAccordionHeader-label">{label}</span>
      <span
        className={cx(styles.icon, 'SfxAccordionHeader-icon')}
        aria-hidden="true"
      >
        <span
          className={cx(styles.arrow, 'SfxArrowTick-root')}
          data-expanded={expanded || undefined}
        >
          <ArrowBottom size={11} />
        </span>
      </span>
    </button>
    {expanded && (
      <div
        id={id}
        role="region"
        aria-labelledby={`${id}-header`}
        className={cx(styles.details, 'SfxAccordionDetails-root')}
      >
        {children}
      </div>
    )}
  </div>
);

Accordion.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  expanded: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
};

export default Accordion;
