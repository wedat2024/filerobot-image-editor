/** External Dependencies */
import styled from 'styled-components';
import Input from '@scaleflex/ui/core/input';
import Select from '@scaleflex/ui/core/select';
import Button from '@scaleflex/ui/core/button';

const StyledFontFamilySelect = styled(Select)`
  width: 160px;
`;

const StyledSelect = styled.select`
  width: 160px;
  margin-left: 5px;
  height: 30px;
  border: 1px solid rgb(204, 214, 222);
  padding: 6px 10px;
  color: rgb(55, 65, 75);
  background-color: rgb(255, 255, 255);
  border-radius: 4px;
`;

const StyledFontSizeInput = styled(Input)`
  width: 72px;
`;

const StyledFontSizeSelector = styled(Button).attrs((props) => ({
  active: props.active || false,
}))`
  width: 24px;
  height: 32px;
  margin-left: 5px;

  ${({ active }) =>
    active &&
    `
      background-color: rgb(104, 121, 235);
    `}
`;

const StyledToolsWrapper = styled.div`
  display: flex;
`;

export {
  StyledFontFamilySelect,
  StyledSelect,
  StyledFontSizeInput,
  StyledToolsWrapper,
  StyledFontSizeSelector,
};
