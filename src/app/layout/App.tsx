import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import NavBar from "./NavBar";
import { Outlet, ScrollRestoration } from "react-router";
import { useAppSelector } from "../store/store";

function App() {
  const { darkMode } = useAppSelector((state) => state.ui);

  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: darkMode ? "#121212" : "#eaeaea",
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <ScrollRestoration />
        <CssBaseline />
        <NavBar />
        <Box
          sx={{
            minHeight: "100vh",
            background: darkMode
              ? "radial-gradient(circle, #1e3aBa, #111B27)"
              : "radial-gradient(circle, #baecf9, #f0f9ff)",
            py: 6,
          }}
        >
          <Container maxWidth="xl" sx={{ mt: 8 }}>
            <Outlet />
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
