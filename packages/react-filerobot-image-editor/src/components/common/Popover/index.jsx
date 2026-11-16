import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import AnchoredMenu from 'components/common/AnchoredMenu';

const FOCUSABLE =
  'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';

// A settings panel uses normal Tab order, not action-menu arrow navigation.
const Popover = ({ anchor, onClose, children, ...props }) => {
  const panelRef = useRef(null);
  const getTrigger = () =>
    anchor.matches('button, [tabindex]')
      ? anchor
      : anchor.querySelector('button');

  useEffect(() => {
    const first = panelRef.current.querySelector(FOCUSABLE);

    (first || panelRef.current).focus({ preventScroll: true });
  }, []);

  const dismiss = () => {
    getTrigger()?.focus({ preventScroll: true });
    onClose();
  };

  const onKeyDown = (event) => {
    // A nested color dialog also bubbles through React portals. Leave it alone.
    if (event.defaultPrevented || !event.currentTarget.contains(event.target))
      return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      dismiss();
    } else if (event.key === 'Tab') {
      const fields = Array.from(
        panelRef.current.querySelectorAll(FOCUSABLE),
      ).filter((element) => element.getClientRects().length);
      const boundary = event.shiftKey ? fields[0] : fields[fields.length - 1];

      if (!fields.length || event.target === boundary) {
        // Continue native Tab from the opener in the editor, not the body portal.
        dismiss();
      }
    }
  };

  return (
    <AnchoredMenu
      {...props}
      anchor={anchor}
      surfaceRef={panelRef}
      onClose={dismiss}
      role="dialog"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      {children}
    </AnchoredMenu>
  );
};

Popover.propTypes = {
  anchor: PropTypes.instanceOf(Element).isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Popover;
