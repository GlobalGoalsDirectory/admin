import { TextField } from "@material-ui/core";
import styled from "styled-components";
import Color from "color";

const StyledTextField = styled(TextField)`
  && > div {
    background: ${({ styled }) => styled.lightestColor};

    &:hover {
      background: ${({ styled, disabled }) =>
        disabled ? styled.lightestColor : styled.lightColor};
    }

    &.Mui-focused {
      background: ${({ styled }) => styled.lightestColor};
    }
  }

  && > label {
    color: ${({ styled }) => styled.darkColor};
  }

  .MuiFilledInput-underline::after {
    border-bottom-color: ${({ styled }) => styled.darkColor};
  }
`;

const ReviewTextField = ({ value, color, ...props }) => (
  <StyledTextField
    value={value || ""}
    fullWidth
    variant="filled"
    {...props}
    styled={{
      lightestColor: Color(color).lightness(85),
      lightColor: Color(color).lightness(80),
      darkColor: Color(color).lightness(40),
    }}
  />
);

export default ReviewTextField;
