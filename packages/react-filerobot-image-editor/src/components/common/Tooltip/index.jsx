import { cloneElement, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import tippy from 'tippy.js';
import PropTypes from 'prop-types';

import { useStore } from 'hooks';
import TooltipContent, { tooltipClassName } from 'ui/Tooltip';

const hideOnEscape = {
  name: 'hideOnEscape',
  defaultValue: true,
  fn: ({ hide }) => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') hide();
    };
    const remove = () => document.removeEventListener('keydown', onKeyDown);

    return {
      onShow: () => document.addEventListener('keydown', onKeyDown),
      onHide: remove,
      onDestroy: remove,
    };
  },
};

const Tooltip = ({ title, children }) => {
  const {
    theme: { palette, typography, shape },
  } = useStore();
  const [reference, setReference] = useState(null);
  const [content] = useState(() => document.createElement('div'));
  const instanceRef = useRef(null);
  const font = typography.font['text-extra-small'];

  useLayoutEffect(() => {
    if (!reference) return undefined;

    const instance = tippy(reference, {
      content,
      placement: 'top',
      interactive: true,
      arrow: true,
      delay: [0, 0],
      offset: [0, 10],
      animation: 'scale',
      appendTo: document.body,
      ignoreAttributes: true,
      aria: { content: 'describedby', expanded: false },
      plugins: [hideOnEscape],
    });

    instance.popper.firstElementChild.classList.add(
      ...tooltipClassName.split(' '),
    );
    instanceRef.current = instance;

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [reference, content]);

  useLayoutEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;

    const variables = {
      '--fie-tooltip-radius': shape.borderRadius.md,
      '--fie-tooltip-background': palette['icons-placeholder'],
      '--fie-tooltip-color': palette['link-active'],
      '--fie-tooltip-font-family': font.fontFamily,
      '--fie-tooltip-font-size': font.fontSize,
      '--fie-tooltip-font-weight': font.fontWeight,
      '--fie-tooltip-line-height': font.lineHeight,
    };

    Object.entries(variables).forEach(([key, value]) =>
      instance.popper.style.setProperty(key, value),
    );
  }, [reference, palette, font, shape]);

  return (
    <>
      {cloneElement(children, { ref: setReference })}
      {createPortal(
        <TooltipContent style={font}>{title}</TooltipContent>,
        content,
      )}
    </>
  );
};

Tooltip.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.element.isRequired,
};

export default Tooltip;
