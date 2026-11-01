import { createTheme } from "@mui/material/styles";

export const colors = {
  bg: "#0e0b13",
  surface: "#18131f",
  surfaceDeep: "#130f19",
  line: "#2f2539",
  lineStrong: "#49365f",
  text: "#f5f2fa",
  textSoft: "#d9cdf0",
  muted: "#92889e",
  accent: "#a78bfa",
  accentSoft: "#c8b5ff",
  accentBg: "#2a1f3d",
  danger: "#ffb4c0",
  dangerLine: "#713c4a",
  dangerBg: "#301922",
};

export const pageBackground =
  "radial-gradient(ellipse at 15% 10%, #302044 0%, transparent 40%), radial-gradient(ellipse at 90% 85%, #21152f 0%, transparent 40%), #0e0b13";

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: "clamp(26px, 4vw, 34px)",
      lineHeight: 1.2,
      letterSpacing: "-0.4px",
      color: colors.text,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: "20px",
      color: colors.text,
    },
  },
  palette: {
    mode: "dark",
    primary: { main: colors.accent },
    error: { main: "#ff8fa3" },
    background: { default: colors.bg, paper: colors.surface },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "13px",
          padding: "8px 16px",
          transition: "background 0.2s, border-color 0.2s",
        },
        outlinedPrimary: {
          borderColor: colors.lineStrong,
          color: colors.accentSoft,
          "&:hover": { borderColor: colors.accent, backgroundColor: "#21182e" },
        },
        outlinedError: {
          borderColor: colors.dangerLine,
          color: colors.danger,
          "&:hover": { borderColor: "#9d4d5c", backgroundColor: colors.dangerBg },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundImage: "none", backgroundColor: colors.surface } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: colors.surface,
          border: `1px solid ${colors.line}`,
          borderRadius: "18px",
        },
      },
    },
  },
});

export default theme;
