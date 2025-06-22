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
import { useFetchBasketQuery } from '../../features/basket/basketApi';
import UserMenu from './UserMenu';
import { useUserInfoQuery } from '../../features/auth/authApi';
import NavBarMenu from './NavBarMenu';
import navStyles from './navStyles';

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
  const { data: user } = useUserInfoQuery();
  const { isLoading, darkMode } = useAppSelector((state) => state.ui);

  const dispatch = useAppDispatch();
  const { data: basket } = useFetchBasketQuery();
  const itemCount =
    basket?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

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
          <NavBarMenu />
        </List>

        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            sx={{ color: 'inherit' }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user?.result ? (
            <UserMenu user={user.result} />
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
