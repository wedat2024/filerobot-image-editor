import { forwardRef } from 'react';
import { Group } from 'react-konva';

const PreviewGroup = forwardRef((props, ref) => {
  return <Group ref={ref} {...props} />;
});

export default PreviewGroup;
