import FieArrowButton from '@scaleflex/ui/core/button';
import React, { useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import { DesignLayer, TransformersLayer } from 'components/Layers';
import { AppProviderOverridenValue } from 'context';
import { SET_CANVAS_SIZE } from 'actions';
import { useResizeObserver, useStore } from 'hooks';
import NodeControls from 'components/NodeControls';
import PropTypes from 'prop-types';
import { ArrowLeftOutline, ArrowRightOutline } from '@scaleflex/icons';
import CanvasNode from './CanvasNode';

import MainCanvasStyles from './MainCanvas.module.css';

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
    <div
      ref={canvasContainerRef}
      className={cx(MainCanvasStyles.canvasContainer, 'FIE_canvas-container')}
    >
      {withControls && (
        <>
          {/* Previous Button */}
          <FieArrowButton
            style={{
              left: 40,
            }}
            onClick={onPrev}
            className={MainCanvasStyles.arrowButton}
          >
            <ArrowLeftOutline />
          </FieArrowButton>

          {/* Next Button */}
          <FieArrowButton
            style={{
              right: 40,
            }}
            onClick={onNext}
            className={MainCanvasStyles.arrowButton}
          >
            <ArrowRightOutline />
          </FieArrowButton>
        </>
      )}

      {!providedAppContext.textIdOfEditableContent && <NodeControls />}
      {providedAppContext.isShowOriginalImage && (
        // eslint-disable-next-line jsx-a11y/alt-text -- Preserve the existing original-image preview during CSS migration.
        <img
          src={providedAppContext.originalImage.src}
          className={cx(
            MainCanvasStyles.orignalImage,
            'FIE_original-image-compare',
          )}
        />
      )}
      <CanvasNode>
        <AppProviderOverridenValue overridingValue={providedAppContext}>
          <DesignLayer />
          <TransformersLayer />
        </AppProviderOverridenValue>
      </CanvasNode>
    </div>
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
