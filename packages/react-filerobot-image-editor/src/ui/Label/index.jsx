/** External Dependencies */
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/** Internal Dependencies */
import styles from './Label.module.css';

const Label = forwardRef(
  ({ children = null, className, textProps, htmlFor, ...props }, ref) => {
    const Element = htmlFor ? 'label' : 'span';

    return (
      <Element
        htmlFor={htmlFor}
        {...props}
        ref={ref}
        className={cx(styles.label, 'SfxLabel-root', className)}
      >
        <span {...textProps} className={cx(styles.text, 'SfxLabel-text')}>
          {children}
        </span>
      </Element>
    );
  },
);

Label.displayName = 'Label';
Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  textProps: PropTypes.instanceOf(Object),
};

export default Label;
