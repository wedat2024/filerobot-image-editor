/** External Dependencies */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@scaleflex/ui/core/menu-item';
import FontBold from '@scaleflex/icons/font-bold';
import FontItalic from '@scaleflex/icons/font-italic';

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
  const { fonts = [], fontSizes = [], onFontChange } = config[TOOLS_IDS.TEXT];

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
        onFontChange(newFontFamily, reRenderCanvasFn);
      }
    },
    [changeTextProps, text, designLayer],
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

  const standardFontSizes = useMemo(
    () =>
      Array.isArray(fontSizes) && !!fontSizes.length
        ? Array.from(new Set(fontSizes))
        : [15, 25, 35],
    [fontSizes],
  );

  const [selectedFontSize, setSelectedFontSize] = useState();

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
      {Array.isArray(fonts) && fonts.length > 1 && (
        <StyledFontFamilySelect
          className="FIE_text-font-family-option"
          onChange={changeFontFamily}
          value={text.fontFamily}
          placeholder={t('fontFamily')}
          size="sm"
        >
          {/* fontFamily is string or object */}
          {fonts.map((fontFamily = '') => (
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
      <div
        style={{
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
        }}
      >
        <StyledFontSizeInput
          className="FIE_text-size-option"
          value={text.fontSize || ''}
          name="fontSize"
          onChange={changeTextProps}
          inputMode="numeric"
          type="number"
          size="sm"
          placeholder={t('size')}
        />

        {standardFontSizes.map((standardFontSize) => {
          return (
            <StyledFontSizeSelector
              className={`FIE_text-size-option-selector-${standardFontSize}`}
              key={standardFontSize}
              onClick={() => {
                setSelectedFontSize(standardFontSize);
                saveText((latestText) => ({
                  id: latestText.id,
                  fontSize: standardFontSize,
                }));
              }}
              active={selectedFontSize === standardFontSize}
            >
              {standardFontSize}
            </StyledFontSizeSelector>
          );
        })}
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
