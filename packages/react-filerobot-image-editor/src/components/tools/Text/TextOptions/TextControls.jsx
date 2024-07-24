/** External Dependencies */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TooltipV2, MenuItem, Select } from '@scaleflex/ui/core';
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
  StyledSelect,
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
  const [selectedFontSize, setSelectedFontSize] = useState(null);

  useEffect(() => {
    saveText((latestText) => ({
      ...latestText,
      ...selectedText,
    }));
  }, [selectedText, saveText]);

  const changeDefaultText = useCallback(
    (selectedValueIndex) => {
      if (selectedValueIndex !== selectedTextIndex) {
        setSelectedTextIndex(selectedValueIndex);
        setSelectedText((prevSelectedText) => {
          const foundText = texts[selectedValueIndex];
          if (foundText) {
            setSelectedFontSize(null);
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
    [text],
  );

  const disableTextEdit = useCallback(() => {
    dispatch({
      type: ENABLE_TEXT_CONTENT_EDIT,
      payload: {
        textIdOfEditableContent: null,
      },
    });
  }, []);

  const changeTextContent = useCallback((newContent) => {
    changeTextProps({
      target: {
        name: 'text',
        value: newContent,
      },
    });
    disableTextEdit();
  }, []);

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
  }, [textIdOfEditableContent]);

  const changeFontSize = useCallback(
    (selectedSize) => {
      setSelectedFontSize(selectedSize);
      changeTextProps({
        target: { name: 'fontSize', value: selectedSize },
      });
    },
    [changeTextProps],
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
                filteredText.text
                  ? `${filteredText.text}-${index.toString()}`
                  : index.toString()
              }
              value={index}
            >
              {filteredText.text}
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
            setSelectedFontSize(null);
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
              <TooltipV2
                title={`Font Size: ${standardFontSize}`}
                key={standardFontSize}
              >
                <StyledFontSizeSelector
                  className={`FIE_text-size-option-selector-${standardFontSize}`}
                  onClick={() => changeFontSize(standardFontSize)}
                  active={
                    selectedFontSize === standardFontSize ||
                    standardFontSize === Number(text.fontSize)
                  }
                >
                  {standardFontSize}
                </StyledFontSizeSelector>
              </TooltipV2>
            );
          })
        ) : (
          <StyledSelect
            className="FIE_text-font-size-option"
            onChange={(e) => {
              const { value } = e.target;
              const numberValue = Number(value);

              if (numberValue && !Number.isNaN(numberValue)) {
                changeFontSize(numberValue);
              }
            }}
            placeholder={t('fontSizes')}
          >
            {standardFontSizes.map((standardFontSize) => {
              return (
                <option key={standardFontSize} value={standardFontSize}>
                  {standardFontSize}
                </option>
              );
            })}
          </StyledSelect>
        )}
      </div>

      <StyledToolsWrapper>
        {!useCloudimage && (
          <>
            <TooltipV2 title="Font Style: Bold">
              <StyledIconWrapper
                className="FIE_text-bold-option"
                active={(text.fontStyle || '').includes('bold')}
                onClick={() => changeFontStyle('bold')}
                watermarkTool
              >
                <FontBold size={20} />
              </StyledIconWrapper>
            </TooltipV2>

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
