/** External Dependencies */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import { SET_LATEST_COLOR } from 'actions';
import ColorPickerModal from '../ColorPickerModal';
import { StyledColor, StyledPickerTrigger } from './ColorInput.styled';

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
    onChange(rgba);
    changePinnedColors(newPinnedColors);

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

  const allColors = ['green', 'red', 'blue', 'brown', 'yellow', 'white'];

  const handleSingleColorClick = (selectedColor) => {
    setCurrentBlockColor(selectedColor);
    changeColor(selectedColor, selectedColor, pinnedColors);
  };

  return (
    <>
      {allColors.map((singleColor, index) => (
        <StyledColor
          key={`${singleColor}-${index.toString()}`}
          currentColor={singleColor}
          isActive={currentBlockColor === singleColor}
          onClick={() => handleSingleColorClick(singleColor)}
        />
      ))}
      <StyledPickerTrigger
        className="FIE_color-picker-triggerer"
        onClick={togglePicker}
        $color={currentColor}
        onChange={onChange}
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
