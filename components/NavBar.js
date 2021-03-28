import Link from "next/link";
import {
  AppBar,
  Box,
  ButtonBase,
  Container,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "mdi-material-ui";
import styled from "styled-components";

const Button = styled(ButtonBase).attrs({
  component: "a",
})`
  && {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-self: stretch;
    padding: 0 16px;
  }
`;

const StyledToolbar = styled(Toolbar)`
  && {
    min-height: 64px;
    height: 64px;
    max-height: 64px;

    ${(props) => props.theme.breakpoints.up("sm")} {
      min-height: 88px;
      height: 88px;
      max-height: 88px;
    }
  }
`;

const NavBar = ({ openMobileSideMenu }) => (
  <>
    <AppBar position="fixed" color="primary" elevation={1}>
      <StyledToolbar disableGutters={true}>
        <Box
          display="flex"
          flexDirection="column"
          justifyItems="center"
          width={1}
          height={1}
        >
          <Box flexGrow={1} display="flex">
            <Container
              maxWidth={false}
              disableGutters={true}
              style={{
                alignSelf: "stretch",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Hidden implementation="css" mdUp>
                <Box display="flex" marginLeft={1}>
                  <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={openMobileSideMenu}
                  >
                    <Menu />
                  </IconButton>
                </Box>
              </Hidden>
              <Link href="/" passHref>
                <Button>
                  <Typography variant="h4" component="p">
                    Global Goals Directory - Admin Dashboard
                  </Typography>
                </Button>
              </Link>
            </Container>
          </Box>
        </Box>
      </StyledToolbar>
    </AppBar>
    <StyledToolbar />
  </>
);

export default NavBar;
