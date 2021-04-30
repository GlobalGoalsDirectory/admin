import { useEffect, useState } from "react";
import { green, red, grey as gray } from "@material-ui/core/colors";
import styled from "styled-components";
const diff = require("diff");

const StyledSpan = styled.span`
  color: ${({ styled }) => {
    if (styled?.isAdded) return green[700];
    if (styled?.isRemoved) return red[700];
    return gray[700];
  }};

  text-decoration: ${({ styled }) =>
    styled?.isRemoved ? "line-through" : "none"};
`;

const Diff = ({ before, after }) => {
  if (before == null) before = "";
  if (after == null) after = "";

  const [parts, setParts] = useState(diff.diffChars(before, after));

  useEffect(() => setParts(diff.diffChars(before, after)), [before, after]);

  return (
    <>
      {before === "" && after === "" && (
        <StyledSpan style={{ fontStyle: "italic" }}>No value</StyledSpan>
      )}
      {parts.map((part, index) => (
        <StyledSpan
          key={index}
          styled={{ isAdded: part.added, isRemoved: part.removed }}
        >
          {part.value}
        </StyledSpan>
      ))}
    </>
  );
};

export default Diff;
