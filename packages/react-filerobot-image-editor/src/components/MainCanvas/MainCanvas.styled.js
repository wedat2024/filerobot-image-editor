/** External Dependencies */
import Button from '@scaleflex/ui/core/button';
import { Stage } from 'react-konva';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;
  position: relative;
  // backup for flex-grow, 94px, 12px = toolsbar's maxheight, app container padding.
  height: calc(100% - 112px - 16px);
  overflow: hidden;
  min-height: 250px;
  padding: 16px;
  flex-grow: 1;
`;

const StyledOrignalImage = styled.img`
  max-width: 98%;
  max-height: 98%;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const StyledCanvasNode = styled(Stage)`
  outline: none;
  background: ${({ theme }) => theme.palette['bg-hover']};
`;

const StyledArrowButton = styled(Button)`
  position: absolute;
  top: 50%;
  z-index: 10;
  border-radius: 8px;
  padding: 14px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

export {
  CanvasContainer,
  StyledOrignalImage,
  StyledCanvasNode,
  StyledArrowButton,
};
