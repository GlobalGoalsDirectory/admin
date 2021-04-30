import { Box, Button, CircularProgress } from "@material-ui/core";
import styled from "styled-components";

const ButtonProgress = styled(CircularProgress)`
  && {
    top: 50%;
    left: 50%;
    margin-top: -12px;
    margin-left: -12px;
    position: absolute;
  }
`;

const LoadingButton = ({ children, loading = false, ...props }) => (
  <Box position="relative" display="inline-block">
    <Button disabled={loading} {...props}>
      {children}
    </Button>
    {loading && <ButtonProgress size={24} />}
  </Box>
);

export default LoadingButton;
