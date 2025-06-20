/** External Dependencies */
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { usePhoneScreen, useStore } from 'hooks';
import { Label } from '@scaleflex/ui/core';
import Menu from '@scaleflex/ui/core/menu';
import Transparency from '@scaleflex/icons/transparency';
// import Shadow from '@scaleflex/icons/shadow';
// import Position from '@scaleflex/icons/position';
import Stroke from '@scaleflex/icons/stroke';

/** Internal Dependencies */
import OpacityField from './OpacityField';
import StrokeFields from './StrokeFields';
import ShadowFields from './ShadowFields';
import PositionFields from './PositionFields';
import {
  StyledOptionPopupContent,
  StyledOptions,
  StyledOptionsWrapper,
  StyledIconWrapper,
  ColorInputWrapper,
} from './AnnotationOptions.styled';
import { POPPABLE_OPTIONS } from './AnnotationOptions.constants';
import ColorInput from '../ColorInput';

const AnnotationOptions = ({
  children,
  morePoppableOptionsPrepended,
  moreOptionsPopupComponentsObj,
  morePoppableOptionsAppended,
  annotation,
  updateAnnotation,
  hideFillOption,
  hidePositionField,
  className,
  withoutOptions,
  ...rest
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentOption, setCurrentOption] = useState(null);
  const {
    config: { useCloudimage },
    t,
    toolId,
  } = useStore();

  const isPhoneScreen = usePhoneScreen(320);
  const isBigPhoneScreen = usePhoneScreen(425);

  const options = useMemo(
    () =>
      withoutOptions
        ? []
        : [
            ...morePoppableOptionsPrepended,
            {
              titleKey: 'opacity',
              name: POPPABLE_OPTIONS.OPACITY,
              Icon: Transparency,
            },
            ...(!useCloudimage
              ? [
                  {
                    titleKey: 'stroke',
                    name: POPPABLE_OPTIONS.STROKE,
                    Icon: Stroke,
                  },
                  // {
                  //   titleKey: 'shadow',
                  //   name: POPPABLE_OPTIONS.SHADOW,
                  //   Icon: Shadow,
                  // },
                ]
              : []),
            // !hidePositionField
            //   ? {
            //       titleKey: 'position',
            //       name: POPPABLE_OPTIONS.POSITION,
            //       Icon: Position,
            //     }
            //   : undefined,
          ],
    [morePoppableOptionsPrepended],
  );

  const optionsPopups = useMemo(
    () => ({
      ...moreOptionsPopupComponentsObj,
      [POPPABLE_OPTIONS.OPACITY]: OpacityField,
      [POPPABLE_OPTIONS.STROKE]: StrokeFields,
      [POPPABLE_OPTIONS.SHADOW]: ShadowFields,
      [POPPABLE_OPTIONS.POSITION]: PositionFields,
      ...morePoppableOptionsAppended,
    }),
    [moreOptionsPopupComponentsObj],
  );

  const toggleOptionPopup = useCallback((e, targetOptionName) => {
    const targetAnchorEl = e?.currentTarget;
    setAnchorEl(targetAnchorEl);
    setCurrentOption(targetOptionName);
  }, []);

  const isStrokeTool = useMemo(
    () => toolId === 'Pen' || toolId === 'Line' || toolId === 'Arrow',
    [toolId],
  );

  const isShape = useMemo(
    () => toolId === 'Rect' || toolId === 'Ellipse' || toolId === 'Polygon',
  );

  const changeStrokeColor = (newStrokeColor) => {
    updateAnnotation({ stroke: newStrokeColor });
  };

  const changeAnnotationStrokeOrFill = useCallback(
    (newColor) => {
      if (isStrokeTool) {
        updateAnnotation({ stroke: newColor });
      } else {
        updateAnnotation({ fill: newColor });
      }
    },
    [updateAnnotation, isStrokeTool],
  );

  const OptionPopupComponent =
    anchorEl && currentOption && optionsPopups[currentOption];

  const renderPositionFields = () => (
    <>
      <Label>{t('position')}</Label>
      <StyledOptionPopupContent position>
        <OptionPopupComponent
          annotation={annotation}
          updateAnnotation={updateAnnotation}
          {...rest}
        />
      </StyledOptionPopupContent>
    </>
  );

  return (
    <StyledOptions
      className={`FIE_annotations-options${className ? ` ${className}` : ''}`}
      isPhoneScreen={isPhoneScreen}
    >
      {!hideFillOption && (!isShape || isBigPhoneScreen) && (
        <ColorInput
          color={isStrokeTool ? annotation.stroke : annotation.fill}
          onChange={changeAnnotationStrokeOrFill}
          colorFor={isStrokeTool ? 'stroke' : 'fill'}
        />
      )}

      {isShape && !isBigPhoneScreen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {!hideFillOption && (
            <ColorInputWrapper>
              <span>{t('fillColor')}</span>
              <ColorInput
                color={isStrokeTool ? annotation.stroke : annotation.fill}
                onChange={changeAnnotationStrokeOrFill}
                colorFor={isStrokeTool ? 'stroke' : 'fill'}
              />
            </ColorInputWrapper>
          )}

          <ColorInputWrapper withMarginTop>
            <span>{t('lineColor')}</span>
            <ColorInput
              color={annotation.stroke}
              onChange={changeStrokeColor}
              colorFor="stroke"
            />
          </ColorInputWrapper>
        </div>
      )}

      {children}

      <StyledOptionsWrapper>
        {options.map(
          (option) =>
            option && (
              <StyledIconWrapper
                className="FIE_annotation-option-triggerer"
                key={option.name}
                title={t(option.titleKey)}
                onClick={(e) => toggleOptionPopup(e, option.name)}
                active={currentOption === option.name}
              >
                <option.Icon size={20} />
              </StyledIconWrapper>
            ),
        )}
      </StyledOptionsWrapper>

      {OptionPopupComponent && (
        <Menu
          className="FIE_annotation-option-popup"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={toggleOptionPopup}
          position="top"
        >
          <StyledOptionPopupContent>
            {currentOption === POPPABLE_OPTIONS.POSITION ? (
              renderPositionFields()
            ) : (
              <OptionPopupComponent
                annotation={annotation}
                updateAnnotation={updateAnnotation}
                showStroke={!isStrokeTool}
                isPhone={isBigPhoneScreen}
                {...rest}
              />
            )}
          </StyledOptionPopupContent>
        </Menu>
      )}
    </StyledOptions>
  );
};

AnnotationOptions.defaultProps = {
  children: undefined,
  morePoppableOptionsPrepended: [],
  moreOptionsPopupComponentsObj: {},
  morePoppableOptionsAppended: [],
  hideFillOption: false,
  hidePositionField: false,
  className: undefined,
  withoutOptions: false,
};

AnnotationOptions.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  children: PropTypes.node,
  hideFillOption: PropTypes.bool,
  morePoppableOptionsPrepended: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  morePoppableOptionsAppended: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  moreOptionsPopupComponentsObj: PropTypes.instanceOf(Object),
  hidePositionField: PropTypes.bool,
  className: PropTypes.string,
  withoutOptions: PropTypes.bool,
};

export default AnnotationOptions;
