import React, { useEffect, useRef } from 'react';
import Tippy from '@tippyjs/react';
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
  const instanceRef = useRef(null);
  const font = typography.font['text-extra-small'];
  const applyTheme = (instance) => {
    instanceRef.current = instance;
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
  };

  useEffect(() => {
    if (instanceRef.current) applyTheme(instanceRef.current);
  }, [palette, typography, shape]);

  return (
    <Tippy
      className={tooltipClassName}
      content={<TooltipContent style={font}>{title}</TooltipContent>}
      placement="top"
      interactive
      arrow
      delay={[0, 0]}
      offset={[0, 10]}
      animation="scale"
      appendTo={document.body}
      aria={{ content: 'describedby', expanded: false }}
      plugins={[hideOnEscape]}
      onCreate={applyTheme}
    >
      {children}
    </Tippy>
  );
};

Tooltip.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.element.isRequired,
};

export default Tooltip;
