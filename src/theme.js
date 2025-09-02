import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#115293",
      light: "#4791db",
    },
    secondary: {
      main: "#f50057",
      dark: "#ab003c",
      light: "#ff4081",
    },
    success: {
      main: "#4caf50",
      dark: "#087f23",
      light: "#80e27e",
    },
    warning: {
      main: "#ff9800",
      dark: "#c66900",
      light: "#ffac33",
    },
    info: {
      main: "#2196f3",
      dark: "#0069c0",
      light: "#6ec6ff",
    },
    error: {
      main: "#d32f2f",
      dark: "#9a0007",
      light: "#ff6659",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.875rem" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "8px 16px",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        borderColor: "#d32f2f",
        },
      },
    },
  },
});

export default theme;