import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';

/** Internal Dependencies */
import { SELECT_ANNOTATION, SET_ANNOTATION } from 'actions';
import randomId from 'utils/randomId';
import debounce from 'utils/debounce';
import { TOOLS_IDS } from 'utils/constants';
import { useStore } from 'hooks';
import { isEqual } from 'lodash';
import previewThenCallAnnotationAdding from './previewThenCallAnnotationAdding';
import useDebouncedCallback from '../useDebouncedCallback';

const useAnnotation = (annotation = {}, enablePreview = true) => {
  const {
    dispatch,
    previewGroup,
    annotations,
    selectionsIds = [],
    config,
  } = useStore();
  const annotationDefaults = {
    ...config.annotationsCommon,
    ...config[annotations[selectionsIds[0]]?.name || annotation.name],
  };
  const [tmpAnnotation, setTmpAnnotation] = useState(() => ({
    ...annotationDefaults,
    ...annotation,
    ...annotations[selectionsIds[0]],
  }));
  const previousTmpAnnotation = useRef(tmpAnnotation);
  const annotationBeforeSelection = useRef(null);
  const canvas = previewGroup?.getStage();

  const saveAnnotation = useCallback(
    (annotationData) => {
      const { fonts, onFontChange, ...savableAnnotationData } = annotationData;
      dispatch({
        type: SET_ANNOTATION,
        payload: savableAnnotationData,
      });
      if (savableAnnotationData.id && annotation.name !== TOOLS_IDS.PEN) {
        debounce(() => {
          dispatch({
            type: SELECT_ANNOTATION,
            payload: { annotationId: savableAnnotationData.id },
          });
        }, 30)();
      }
    },
    [annotation.name, dispatch],
  );

  const updateTmpAnnotation = useDebouncedCallback((updatesObjOrFn) => {
    setTmpAnnotation((latest) => {
      const updates =
        typeof updatesObjOrFn === 'function'
          ? updatesObjOrFn(latest)
          : updatesObjOrFn;

      if (!isEqual(updates, latest)) {
        return {
          ...latest,
          shouldSave: false,
          neverSave: false,
          ...updates,
        };
      }
      return latest;
    });
  }, 15);

  const getAnnotationInitialProps = useCallback(
    (currentAnnotation, newAnnotationName) => {
      if (currentAnnotation.name === newAnnotationName) {
        const {
          x,
          y,
          width,
          height,
          radius,
          radiusX,
          radiusY,
          points,
          image,
          text,
          scaleX,
          scaleY,
          rotation,
          ...dimensionlessProps
        } = currentAnnotation;

        return {
          ...annotationDefaults,
          ...annotation,
          ...dimensionlessProps,
        };
      }

      return {
        ...annotationDefaults,
        ...annotation,
      };
    },
    [annotationDefaults, annotation],
  );

  const saveAnnotationNoDebounce = useCallback(
    (newAnnotationData) => {
      setTmpAnnotation((latest) => {
        const initialProps = getAnnotationInitialProps(
          latest,
          newAnnotationData.name || annotation.name,
        );

        const mergedAnnotation = {
          ...initialProps,
          ...newAnnotationData,
          id:
            newAnnotationData.id ||
            randomId(newAnnotationData.name || latest.name),
          shouldSave: true,
          neverSave: false,
        };

        if (
          previousTmpAnnotation.current.text &&
          mergedAnnotation.text === annotationDefaults.text
        ) {
          mergedAnnotation.text = previousTmpAnnotation.current.text;
        }

        return mergedAnnotation;
      });
    },
    [getAnnotationInitialProps, annotation.name, annotationDefaults.text],
  );

  useEffect(() => {
    const { shouldSave, neverSave, ...savableAnnotation } = tmpAnnotation;
    const selection =
      selectionsIds.length === 1 && annotations[selectionsIds[0]];
    if (!neverSave && (shouldSave || selection)) {
      saveAnnotation({
        ...savableAnnotation,
        id: shouldSave ? savableAnnotation.id : selection.id,
      });
    }
    previousTmpAnnotation.current = tmpAnnotation;
  }, [tmpAnnotation, saveAnnotation, selectionsIds, annotations]);

  useEffect(() => {
    if (selectionsIds.length === 1) {
      const selectedAnnotation = annotations[selectionsIds[0]];

      saveAnnotation({
        ...selectedAnnotation,
        neverSave: true,
      });

      if (selectedAnnotation?.id !== tmpAnnotation.id) {
        setTmpAnnotation({ ...selectedAnnotation, neverSave: true });
      } else {
        setTmpAnnotation({ ...tmpAnnotation, neverSave: true });
      }
    } else if (annotationBeforeSelection.current) {
      setTmpAnnotation({
        ...annotationBeforeSelection.current,
        neverSave: true,
      });
      annotationBeforeSelection.current = null;
    }
  }, [selectionsIds, annotations, tmpAnnotation.id, saveAnnotation]);

  useLayoutEffect(() => {
    let stopAnnotationEventsListening = null;

    if (canvas && enablePreview) {
      const annotationInitialProps = getAnnotationInitialProps(
        tmpAnnotation,
        annotation.name,
      );

      stopAnnotationEventsListening = previewThenCallAnnotationAdding(
        canvas,
        { ...annotationInitialProps, name: annotation.name },
        previewGroup,
        saveAnnotationNoDebounce,
      );
    }

    return () => {
      stopAnnotationEventsListening?.();
    };
  }, [
    canvas,
    tmpAnnotation,
    previewGroup,
    enablePreview,
    annotation.name,
    getAnnotationInitialProps,
    saveAnnotationNoDebounce,
  ]);

  return useMemo(
    () => [tmpAnnotation, updateTmpAnnotation, saveAnnotationNoDebounce],
    [tmpAnnotation, updateTmpAnnotation, saveAnnotationNoDebounce],
  );
};

export default useAnnotation;
