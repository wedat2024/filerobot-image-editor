/** External Dependencies */
import styled from 'styled-components';
import Input from '@scaleflex/ui/core/input';
import Select from '@scaleflex/ui/core/select';
import Button from '@scaleflex/ui/core/button';

const StyledFontFamilySelect = styled(Select)`
  width: 160px;
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
  StyledFontSizeInput,
  StyledToolsWrapper,
  StyledFontSizeSelector,
};
