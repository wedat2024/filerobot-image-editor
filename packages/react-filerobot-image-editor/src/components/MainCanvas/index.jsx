import React, { useCallback, useEffect, useRef } from 'react';
import { DesignLayer, TransformersLayer } from 'components/Layers';
import { AppProviderOverridenValue } from 'context';
import { SET_CANVAS_SIZE } from 'actions';
import { useResizeObserver, useStore } from 'hooks';
import NodeControls from 'components/NodeControls';
import PropTypes from 'prop-types';
import { ArrowLeftOutline, ArrowRightOutline } from '@scaleflex/icons';
import CanvasNode from './CanvasNode';
import {
  CanvasContainer,
  StyledArrowButton,
  StyledOrignalImage,
} from './MainCanvas.styled';

const MainCanvas = ({ controls = {} }) => {
  const {
    withControls = false,
    onPrev = () => {},
    onNext = () => {},
  } = controls;

  const [observeResize] = useResizeObserver();
  const providedAppContext = useStore();
  const canvasContainerRef = useRef(null);

  const setNewCanvasSize = useCallback(
    ({ width, height }) => {
      providedAppContext.dispatch({
        type: SET_CANVAS_SIZE,
        payload: {
          canvasWidth: width,
          canvasHeight: height,
        },
      });
    },
    [providedAppContext],
  );

  useEffect(() => {
    observeResize(canvasContainerRef.current, setNewCanvasSize);
  }, []);

  return (
    <CanvasContainer className="FIE_canvas-container" ref={canvasContainerRef}>
      {withControls && (
        <>
          {/* Previous Button */}
          <StyledArrowButton
            style={{
              left: 40,
            }}
            onClick={onPrev}
          >
            <ArrowLeftOutline />
          </StyledArrowButton>

          {/* Next Button */}
          <StyledArrowButton
            style={{
              right: 40,
            }}
            onClick={onNext}
          >
            <ArrowRightOutline />
          </StyledArrowButton>
        </>
      )}

      {!providedAppContext.textIdOfEditableContent && <NodeControls />}
      {providedAppContext.isShowOriginalImage && (
        <StyledOrignalImage
          className="FIE_original-image-compare"
          src={providedAppContext.originalImage.src}
        />
      )}
      <CanvasNode>
        <AppProviderOverridenValue overridingValue={providedAppContext}>
          <DesignLayer />
          <TransformersLayer />
        </AppProviderOverridenValue>
      </CanvasNode>
    </CanvasContainer>
  );
};

MainCanvas.propTypes = {
  controls: PropTypes.shape({
    withControls: PropTypes.bool,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
  }),
};

MainCanvas.defaultProps = {
  controls: {
    withControls: false,
    onPrev: () => {},
    onNext: () => {},
  },
};

export default MainCanvas;
