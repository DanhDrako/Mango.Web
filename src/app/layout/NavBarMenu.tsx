import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { History, Logout, Redeem } from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";
import { Link } from "react-router";
import navStyles from "./navStyles";

export default function NavBarMenu() {
  const [logout] = useLogoutMutation();
  // This component renders a user menu with options for profile, orders, and logout.
  // It uses Material-UI components for the menu and icons.
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // The anchorEl state holds the current element that the menu is anchored to.
  // The open variable determines if the menu is currently open based on the anchorEl state.
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // This function sets the anchor element for the menu when the button is clicked.
    // It uses the current target of the event to position the menu.
    setAnchorEl(event.currentTarget);
  };

  // The handleClick function is called when the user clicks the button to open the menu.
  // It sets the anchor element to the button that was clicked, allowing the menu to be positioned relative to it.
  const handleClose = () => {
    // This function closes the menu by setting the anchor element to null.
    // It is called when the menu is closed, either by clicking outside or selecting an option.
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick} color="inherit" size="large" sx={navStyles}>
        {"Management"}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // This component renders a menu that appears when the user clicks the button.
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem component={Link} to="/coupons">
          <ListItemIcon>
            <Redeem />
          </ListItemIcon>
          <ListItemText>Coupon</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/orders">
          <ListItemIcon>
            <History />
          </ListItemIcon>
          <ListItemText>My orders</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
