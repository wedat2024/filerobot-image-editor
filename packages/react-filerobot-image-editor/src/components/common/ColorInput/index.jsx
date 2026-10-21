/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Preserve existing click behavior during CSS migration. */
/** External Dependencies */
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import { SET_LATEST_COLOR } from 'actions';
import ColorPickerModal from '../ColorPickerModal';
import ColorInputStyles from './ColorInput.module.css';

const pinnedColorsKey = 'FIE_pinnedColors';

// colorFor is used to save the latest color for a specific purpose (e.g. fill/shadow/stroke)
const ColorInput = ({ onChange, color, colorFor }) => {
  const {
    selectionsIds = [],
    config: { annotationsCommon = {} },
    dispatch,
    latestColors = {},
  } = useStore();
  const latestColor = latestColors[colorFor];
  const [anchorEl, setAnchorEl] = useState();
  const [currentColor, setCurrentColor] = useState(
    () => latestColor || color || annotationsCommon.fill,
  );
  const [currentBlockColor, setCurrentBlockColor] = useState('');
  const [pinnedColors, setPinnedColors] = useState(
    window?.localStorage
      ? JSON.parse(localStorage.getItem(pinnedColorsKey) || '[]')
      : [],
  );

  const changePinnedColors = (newPinnedColors) => {
    if (!window?.localStorage) {
      return;
    }
    const localStoragePinnedColors =
      window.localStorage.getItem(pinnedColorsKey);
    if (JSON.stringify(newPinnedColors) !== localStoragePinnedColors) {
      const maxOfSavedColors = 9;
      const pinnedColorsToSave = newPinnedColors.slice(-maxOfSavedColors);
      window.localStorage.setItem(
        pinnedColorsKey,
        JSON.stringify(pinnedColorsToSave),
      );
      setPinnedColors(pinnedColorsToSave);
    }
  };

  const changeColor = (_newColorHex, rgba, newPinnedColors) => {
    setCurrentColor(rgba);
    changePinnedColors(newPinnedColors);
    onChange(rgba);

    if (latestColor !== rgba) {
      dispatch({
        type: SET_LATEST_COLOR,
        payload: {
          latestColors: {
            [colorFor]: rgba,
          },
        },
      });
    }
  };

  const togglePicker = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  useEffect(() => {
    const colorToSet = (selectionsIds.length === 0 && latestColor) || color;
    setCurrentColor(colorToSet);
    onChange(colorToSet);
  }, [color, selectionsIds]);

  const allColors = [
    'transparent',
    'green',
    'red',
    'blue',
    'brown',
    'yellow',
    'white',
  ];

  const handleSingleColorClick = (selectedColor) => {
    setCurrentBlockColor(selectedColor);
    changeColor(selectedColor, selectedColor, pinnedColors);
  };

  return (
    <>
      {allColors.map((singleColor, index) => (
        <div
          key={`${singleColor}-${index.toString()}`}
          onClick={() => handleSingleColorClick(singleColor)}
          style={{
            background:
              singleColor === 'transparent'
                ? 'repeating-conic-gradient(rgb(93, 109, 126) 0%, rgb(93, 109, 126) 25%, transparent 0%, transparent 50%) 50% center / 8px 8px'
                : singleColor,
            boxShadow:
              currentBlockColor === singleColor
                ? '0px 0px 15px blue'
                : undefined,
          }}
          className={ColorInputStyles.color}
        />
      ))}
      <div
        onClick={togglePicker}
        onChange={onChange}
        style={{
          background:
            currentColor === 'rgba(0,0,0,0)'
              ? 'repeating-conic-gradient(#5d6d7e 0% 25%, transparent 0% 50%) 50% / 8px 8px'
              : currentColor,
        }}
        className={cx(
          ColorInputStyles.pickerTrigger,
          'FIE_color-picker-triggerer',
        )}
      />
      <ColorPickerModal
        hideModalTitle
        onChange={changeColor}
        defaultColor={currentColor}
        pinnedColors={pinnedColors}
        open={Boolean(anchorEl)}
        onClose={togglePicker}
      />
    </>
  );
};

ColorInput.defaultProps = {
  color: undefined,
};

ColorInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  colorFor: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default ColorInput;
