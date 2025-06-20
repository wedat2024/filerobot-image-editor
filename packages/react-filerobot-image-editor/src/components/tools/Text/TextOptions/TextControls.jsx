/** External Dependencies */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select, TooltipV2 } from '@scaleflex/ui/core';

/** Internal Dependencies */
import { TOOLS_IDS, TRANSFORMERS_LAYER_ID } from 'utils/constants';
import AnnotationOptions from 'components/common/AnnotationOptions';
import { ENABLE_TEXT_CONTENT_EDIT } from 'actions';
import restrictNumber from 'utils/restrictNumber';
import { useStore } from 'hooks';
import {
  StyledFontSizeSelector,
  StyledToolsWrapper,
} from './TextOptions.styled';
import {
  activateTextChange,
  deactivateTextChange,
} from './handleTextChangeArea';

const TextControls = ({ text, saveText, children }) => {
  const { dispatch, textIdOfEditableContent, designLayer, t, config } =
    useStore();
  const { texts = [] } = config[TOOLS_IDS.TEXT];

  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const [selectedText, setSelectedText] = useState(texts[0]);
  const [selectedFontSize, setSelectedFontSize] = useState('');

  useEffect(() => {
    saveText((latestText) => {
      const { name, ...restSelectedText } = selectedText;

      return {
        ...latestText,
        ...restSelectedText,
      };
    });
  }, [selectedText, saveText]);

  const changeDefaultText = useCallback(
    (selectedValueIndex) => {
      if (selectedValueIndex !== selectedTextIndex) {
        setSelectedTextIndex(selectedValueIndex);
        setSelectedText((prevSelectedText) => {
          const foundText = texts[selectedValueIndex];
          if (foundText) {
            setSelectedFontSize('');
            return foundText;
          }
          return prevSelectedText;
        });
      }
    },
    [texts, selectedTextIndex],
  );

  const sizes = ['S', 'M', 'L'];

  const standardFontSizes = useMemo(() => {
    const options =
      Array.isArray(selectedText?.fontSizes) && !!selectedText.fontSizes.length
        ? Array.from(new Set(selectedText.fontSizes)).filter(Number)
        : [15, 25, 35];

    return options.map((option, index) => ({
      label: sizes[index],
      value: option,
    }));
  }, [selectedText]);

  const changeTextProps = useCallback(
    (e) => {
      const { name, value, type } = e.target;
      saveText((latestText) => ({
        id: latestText.id,
        [name]: type === 'number' ? restrictNumber(value, 1, 500) : value,
      }));
    },
    [saveText],
  );

  const disableTextEdit = useCallback(() => {
    dispatch({
      type: ENABLE_TEXT_CONTENT_EDIT,
      payload: {
        textIdOfEditableContent: null,
      },
    });
  }, [dispatch]);

  const changeTextContent = useCallback(
    (newContent) => {
      changeTextProps({
        target: {
          name: 'text',
          value: newContent,
        },
      });
      disableTextEdit();
    },
    [changeTextProps, disableTextEdit],
  );

  useEffect(() => {
    let transformer;
    if (textIdOfEditableContent && text.id === textIdOfEditableContent) {
      const canvasStage = designLayer.getStage();
      [transformer] = canvasStage.findOne(`#${TRANSFORMERS_LAYER_ID}`).children;
      activateTextChange(
        textIdOfEditableContent,
        canvasStage,
        transformer,
        changeTextContent,
        disableTextEdit,
      );
    }

    return () => {
      if (transformer && textIdOfEditableContent) deactivateTextChange();
    };
  }, [
    textIdOfEditableContent,
    text.id,
    designLayer,
    changeTextContent,
    disableTextEdit,
  ]);

  const changeFontSize = useCallback(
    (selectedSize) => {
      setSelectedFontSize((prevSize) => {
        if (prevSize !== String(selectedSize)) {
          changeTextProps({
            target: { name: 'fontSize', value: selectedSize },
          });
          return String(selectedSize);
        }

        changeTextProps({
          target: { name: 'fontSize', value: selectedText.fontSize },
        });
        return '';
      });
    },
    [selectedText, changeTextProps],
  );

  return (
    <AnnotationOptions
      className="FIE_text-tool-options"
      annotation={text}
      updateAnnotation={saveText}
      morePoppableOptionsPrepended={[]}
      moreOptionsPopupComponentsObj={{}}
      withoutOptions
      t={t}
    >
      {texts && Array.isArray(texts) && (
        <Select
          className="FIE_text-selection-option"
          onChange={changeDefaultText}
          value={selectedTextIndex}
          placeholder={t('textSelection')}
          size="sm"
          style={{
            width: '160px',
          }}
        >
          {texts.map((filteredText, index) => (
            <MenuItem
              className="FIE_text-selection-item"
              key={
                filteredText.name
                  ? `${filteredText.name}-${index.toString()}`
                  : index.toString()
              }
              value={index}
            >
              {filteredText.name || `Sample ${index + 1}`}
            </MenuItem>
          ))}
        </Select>
      )}

      <div>
        {standardFontSizes.slice(0, 3).map((standardFontSize) => {
          return (
            <TooltipV2
              key={standardFontSize.value}
              title={`Font Size: ${standardFontSize.value}`}
            >
              <StyledFontSizeSelector
                className={`FIE_text-size-option-selector-${standardFontSize}`}
                onClick={() => changeFontSize(standardFontSize.value)}
                active={
                  selectedFontSize === standardFontSize.value ||
                  standardFontSize.value === Number(text.fontSize)
                }
              >
                {standardFontSize.label}
              </StyledFontSizeSelector>
            </TooltipV2>
          );
        })}
      </div>

      <StyledToolsWrapper>{children}</StyledToolsWrapper>
    </AnnotationOptions>
  );
};

TextControls.defaultProps = {
  children: null,
};

TextControls.propTypes = {
  text: PropTypes.instanceOf(Object).isRequired,
  saveText: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default TextControls;
