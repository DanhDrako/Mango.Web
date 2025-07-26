import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material';
import { useState } from 'react';
import type { UserDto } from '../models/auth/userDto';
import { History, Inventory, Logout, Person } from '@mui/icons-material';
import { useLogoutMutation } from '../../features/auth/authApi';
import { Link } from 'react-router';
import { SD } from '../../common/utils/keys/SD';

type Props = {
  user: UserDto;
};

export default function UserMenu({ user }: Props) {
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
      <Button
        onClick={handleClick}
        color="inherit"
        size="large"
        sx={{ fontSize: '1.1rem' }}
      >
        {user.email}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // This component renders a menu that appears when the user clicks the button.
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>My profile</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/orders">
          <ListItemIcon>
            <History />
          </ListItemIcon>
          <ListItemText>My orders</ListItemText>
        </MenuItem>
        {user.role === SD.RolesUser.ADMIN && (
          <MenuItem component={Link} to="/inventory">
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText>Inventory</ListItemText>
          </MenuItem>
        )}
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
