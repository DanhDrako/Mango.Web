import { DarkMode, LightMode, ShoppingCart } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Toolbar,
  Typography
} from '@mui/material';
import { Link, NavLink } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setDarkMode } from './uiSlice';
import UserMenu from './UserMenu';
import AdminNavBar from './AdminNavBar';
import navStyles from './navStyles';
import { useInfo } from '../../lib/hook/useInfo';
import { useCart } from '../../lib/hook/useCart';
import SD from '../../common/utils/keys/SD';

const midLinks = [
  { title: 'Catalog', path: '/catalog' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' }
];

const rightLinks = [
  { title: 'Login', path: '/login' },
  { title: 'Register', path: '/register' }
];

export default function NavBar() {
  const { userDto } = useInfo();
  const { cart } = useCart();
  const { isLoading, darkMode } = useAppSelector((state) => state.ui);

  const dispatch = useAppDispatch();

  const itemCount = userDto
    ? cart?.cartDetails?.reduce((total, item) => total + item.quantity, 0) ?? 0
    : 0;

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography component={NavLink} to="/" sx={navStyles} variant="h6">
            Re-store
          </Typography>
          <IconButton onClick={() => dispatch(setDarkMode())}>
            {darkMode ? <DarkMode /> : <LightMode sx={{ color: 'yellow' }} />}
          </IconButton>
        </Box>

        <List sx={{ display: 'flex' }}>
          {midLinks.map(({ title, path }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
              {title.toUpperCase()}
            </ListItem>
          ))}
          {userDto && userDto.role === SD.RolesUser.ADMIN && <AdminNavBar />}
        </List>

        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            to="/cart"
            size="large"
            sx={{ color: 'inherit' }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {userDto ? (
            <UserMenu user={userDto} />
          ) : (
            <List sx={{ display: 'flex' }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>
      {isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
    </AppBar>
  );
}
