import React, { forwardRef } from 'react';
import CrossOutline from '@scaleflex/icons/cross-outline';

import { useStore } from 'hooks';
import CrossButtonView from 'ui/CrossButton';

// The topbar uses the legacy md cross (12px icon); spacing stays at its call site.
const CrossButton = forwardRef((props, ref) => {
  const {
    theme: { palette },
  } = useStore();

  return (
    <CrossButtonView
      {...props}
      ref={ref}
      style={{
        '--fie-cross-color': palette['icons-secondary'],
        '--fie-cross-hover-color': palette['icons-primary'],
        '--fie-cross-active-color': palette['icons-primary-hover'],
        '--fie-cross-hover-background': palette['bg-hover'],
        '--fie-cross-active-background': palette['bg-active'],
        '--fie-cross-focus-color': palette['accent-stateless'],
      }}
    >
      <CrossOutline size={12} />
    </CrossButtonView>
  );
});

CrossButton.displayName = 'CrossButton';

export default CrossButton;
