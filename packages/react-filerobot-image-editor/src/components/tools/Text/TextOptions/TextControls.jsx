/** External Dependencies */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select } from '@scaleflex/ui/core';
import { FontBold, FontItalic } from '@scaleflex/icons';

/** Internal Dependencies */
import { TOOLS_IDS, TRANSFORMERS_LAYER_ID } from 'utils/constants';
import AnnotationOptions from 'components/common/AnnotationOptions';
import { StyledIconWrapper } from 'components/common/AnnotationOptions/AnnotationOptions.styled';
import { ENABLE_TEXT_CONTENT_EDIT } from 'actions';
import restrictNumber from 'utils/restrictNumber';
import { useStore } from 'hooks';
import {
  StyledFontFamilySelect,
  StyledFontSizeInput,
  StyledFontSizeSelector,
  StyledToolsWrapper,
} from './TextOptions.styled';
import {
  textOptionsPopupComponents,
  TEXT_POPPABLE_OPTIONS,
} from './TextOptions.constants';
import {
  activateTextChange,
  deactivateTextChange,
} from './handleTextChangeArea';

const TextControls = ({ text, saveText, children }) => {
  const { dispatch, textIdOfEditableContent, designLayer, t, config } =
    useStore();
  const { useCloudimage } = config;
  const { texts = [] } = config[TOOLS_IDS.TEXT];

  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const [selectedText, setSelectedText] = useState(texts[0]);
  const [selectedFontSize, setSelectedFontSize] = useState('');

  useEffect(() => {
    saveText((latestText) => {
      // eslint-disable-next-line no-shadow
      const { name, text, ...restSelectedText } = selectedText;

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

  const standardFontSizes = useMemo(
    () =>
      Array.isArray(selectedText?.fontSizes) && !!selectedText.fontSizes.length
        ? Array.from(new Set(selectedText.fontSizes)).filter(Number)
        : [15, 25, 35],
    [selectedText],
  );

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

  const changeFontFamily = useCallback(
    (newFontFamily) => {
      changeTextProps({
        target: { name: 'fontFamily', value: newFontFamily },
      });
      if (
        text.fontFamily !== newFontFamily &&
        typeof onFontChange === 'function'
      ) {
        const reRenderCanvasFn = designLayer.draw.bind(designLayer);
        selectedText?.onFontChange?.(newFontFamily, reRenderCanvasFn);
      }
    },
    [changeTextProps, text, designLayer, selectedText],
  );

  const changeFontStyle = useCallback(
    (newStyle) => {
      let fontStyle = text.fontStyle?.replace('normal', '').split(' ') || [];
      if (Object.keys(fontStyle).length > 0 && fontStyle.includes(newStyle)) {
        fontStyle = fontStyle.filter((style) => style !== newStyle);
      } else {
        fontStyle.push(newStyle);
      }

      changeTextProps({
        target: {
          name: 'fontStyle',
          value: fontStyle.join(' ').trim() || 'normal',
        },
      });
    },
    [text, changeTextProps],
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
      morePoppableOptionsPrepended={!useCloudimage ? TEXT_POPPABLE_OPTIONS : []}
      moreOptionsPopupComponentsObj={
        !useCloudimage ? textOptionsPopupComponents : {}
      }
      t={t}
    >
      {texts && Array.isArray(texts) && texts.length > 1 && (
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

      {Array.isArray(selectedText?.fonts) && selectedText.fonts.length > 1 && (
        <StyledFontFamilySelect
          className="FIE_text-font-family-option"
          onChange={changeFontFamily}
          value={text.fontFamily}
          placeholder={t('fontFamily')}
          size="sm"
        >
          {/* fontFamily is string or object */}
          {selectedText.fonts.map((fontFamily = '') => (
            <MenuItem
              className="FIE_text-font-family-item"
              key={fontFamily.value ?? fontFamily}
              value={fontFamily.value ?? fontFamily}
            >
              {fontFamily.label ?? fontFamily}
            </MenuItem>
          ))}
        </StyledFontFamilySelect>
      )}

      <div>
        <StyledFontSizeInput
          className="FIE_text-size-option"
          value={text.fontSize || ''}
          name="fontSize"
          onChange={(e) => {
            setSelectedFontSize('');
            changeTextProps(e);
          }}
          inputMode="numeric"
          type="number"
          size="sm"
          placeholder={t('size')}
        />

        {standardFontSizes.length <= 5 ? (
          standardFontSizes.map((standardFontSize) => {
            return (
              <StyledFontSizeSelector
                key={standardFontSize}
                className={`FIE_text-size-option-selector-${standardFontSize}`}
                onClick={() => changeFontSize(standardFontSize)}
                active={
                  selectedFontSize === standardFontSize ||
                  standardFontSize === Number(text.fontSize)
                }
              >
                {standardFontSize}
              </StyledFontSizeSelector>
            );
          })
        ) : (
          <Select
            className="FIE_text-font-size-option"
            onChange={(e) => {
              const numberValue = Number(e);

              if (numberValue && !Number.isNaN(numberValue)) {
                changeFontSize(numberValue);
              }
            }}
            placeholder={t('fontSizes')}
            value={String(selectedFontSize)}
            size="sm"
            style={{
              minWidth: '160px',
              width: 'max-content',
              marginLeft: '5px',
            }}
          >
            {standardFontSizes.map((standardFontSize) => {
              return (
                <MenuItem
                  key={String(standardFontSize)}
                  className="FIE_font-size-selection-item"
                  value={String(standardFontSize)}
                >
                  {String(standardFontSize)}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </div>

      <StyledToolsWrapper>
        {!useCloudimage && (
          <>
            <StyledIconWrapper
              className="FIE_text-bold-option"
              active={(text.fontStyle || '').includes('bold')}
              onClick={() => changeFontStyle('bold')}
              watermarkTool
            >
              <FontBold size={20} />
            </StyledIconWrapper>

            <StyledIconWrapper
              className="FIE_text-italic-option"
              active={(text.fontStyle || '').includes('italic')}
              onClick={() => changeFontStyle('italic')}
              watermarkTool
            >
              <FontItalic size={20} />
            </StyledIconWrapper>
          </>
        )}
        {children}
      </StyledToolsWrapper>
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
