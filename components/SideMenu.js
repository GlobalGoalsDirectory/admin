import { Box, Drawer, Hidden } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  CheckboxMarkedCircleOutline,
  Domain,
  LogoutVariant,
} from "mdi-material-ui";
import styled from "styled-components";

const StyledDrawer = styled(Drawer).attrs(({ width, PaperProps }) => ({
  style: {
    width: width,
  },
  PaperProps: {
    ...PaperProps,
    ...{
      style: {
        width: width,
      },
    },
  },
}))`
  && {
    ${(props) => (props.open ? null : "width: 0px !important;")}
    transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  }
  &,
  & > div {
    top: 88px;
    bottom: 0px;
    height: auto;
    overflow-y: hidden;
    /* Display below the navbar */
    z-index: 1000;
    overflow-wrap: break-word;
  }
`;

const LeftDrawerBox = styled(Box).attrs({
  id: "desktop-drawer",
})`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
`;

const DrawerContent = () => (
  <>
    <List>
      <ListItem button>
        <ListItemIcon>
          <Domain />
        </ListItemIcon>
        <ListItemText primary="Organizations" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <CheckboxMarkedCircleOutline />
        </ListItemIcon>
        <ListItemText primary="Review" />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button>
        <ListItemIcon>
          <LogoutVariant />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  </>
);

const SideMenu = ({ children, showMobileSideMenu, onCloseMobileSideMenu }) => (
  <>
    <Hidden implementation="css" smDown>
      <Hidden smDown initialWidth="lg">
        <StyledDrawer
          open
          variant="persistent"
          anchor="left"
          width={300}
          PaperProps={{
            elevation: 2,
          }}
        >
          <LeftDrawerBox>
            <DrawerContent />
          </LeftDrawerBox>
        </StyledDrawer>
      </Hidden>
    </Hidden>
    <Hidden mdUp>
      <Drawer
        open={showMobileSideMenu}
        onClose={onCloseMobileSideMenu}
        variant="temporary"
        anchor="left"
        PaperProps={{ style: { minWidth: 200, maxWidth: "80%" } }}
      >
        <DrawerContent />
      </Drawer>
    </Hidden>
  </>
);

export default SideMenu;
