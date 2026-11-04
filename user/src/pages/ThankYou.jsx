import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Box, Card, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

/* ------------------------------------------------------------------ */
/*  Theme (shared look with ConfessionForm / VerifyEmail)              */
/* ------------------------------------------------------------------ */
const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: "clamp(34px, 7vw, 45px)",
      lineHeight: 1.2,
      letterSpacing: "-1px",
      color: "#f5f2fa",
      margin: 0,
    },
  },
  palette: {
    primary: { main: "#a78bfa" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: "48px",
          borderRadius: "12px",
          backgroundColor: "#a78bfa",
          color: "#170e26",
          fontWeight: 700,
          textTransform: "none",
          fontSize: "14px",
          padding: "13px 16px",
          transition: "background 0.2s, transform 0.2s",
          "&:hover": {
            backgroundColor: "#c0adff",
            transform: "translateY(-1px)",
          },
        },
      },
    },
  },
});

/* ------------------------------------------------------------------ */
/*  Animated tick                                                      */
/* ------------------------------------------------------------------ */
function SuccessTick() {
  return (
    <Box
      sx={{
        width: 84,
        height: 84,
        "@media (max-width: 360px)": { width: 68, height: 68 },
        margin: "0 auto 22px",
        "@keyframes ringDraw": {
          from: { strokeDashoffset: 176 },
          to: { strokeDashoffset: 0 },
        },
        "@keyframes tickDraw": {
          from: { strokeDashoffset: 40 },
          to: { strokeDashoffset: 0 },
        },
        "@keyframes popIn": {
          "0%": { transform: "scale(0.85)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        animation: "popIn 0.4s ease-out both",
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
          "& *": { animation: "none !important" },
        },
        filter: "drop-shadow(0 10px 28px rgba(155, 115, 237, 0.35))",
      }}
    >
      <svg
        viewBox="0 0 84 84"
        width="100%"
        height="100%"
        role="img"
        aria-label="Submitted successfully"
        fill="none"
      >
        <circle cx="42" cy="42" r="40" fill="#21182e" />
        <circle
          cx="42"
          cy="42"
          r="28"
          stroke="#a78bfa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="176"
          style={{ animation: "ringDraw 0.7s ease-out 0.1s both" }}
          transform="rotate(-90 42 42)"
        />
        <path
          d="M30 43.5 L38.5 52 L54.5 34"
          stroke="#c8b5ff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          style={{ animation: "tickDraw 0.4s ease-out 0.7s both" }}
        />
      </svg>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the temporary submission session after success.
    api.post("/confessions/finish").catch(() => {});
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          // dvh = the visible height on phones (excludes the browser's address bar)
          "@supports (height: 100dvh)": { minHeight: "100dvh" },
          display: "grid",
          placeItems: "center",
          padding: "32px 18px",
          WebkitTextSizeAdjust: "100%",
          background:
            "radial-gradient(ellipse at 15% 10%, #302044 0%, transparent 40%), radial-gradient(ellipse at 90% 85%, #21152f 0%, transparent 40%), #0e0b13",
          "@media (max-width: 480px)": { padding: "18px 12px" },
          "@media (max-height: 520px) and (orientation: landscape)": {
            padding: "16px 18px",
          },
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 520,
            padding: "40px 30px 30px",
            border: "1px solid #352a40",
            borderRadius: "24px",
            backgroundColor: "rgba(24, 19, 31, 0.92)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
            textAlign: "center",
            "@media (max-width: 480px)": {
              padding: "30px 21px 24px",
              borderRadius: "19px",
            },
            "@media (max-width: 360px)": {
              padding: "26px 16px 20px",
              borderRadius: "16px",
            },
            "@media (min-width: 1200px)": {
              maxWidth: 560,
              padding: "48px 36px 34px",
            },
          }}
        >
          <SuccessTick />

          <Typography
            component="p"
            sx={{
              margin: "0 0 10px",
              color: "#b49bdc",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
            }}
          >
            MESSAGE RECEIVED
          </Typography>

          <Typography variant="h1" component="h1">
            Thank <span style={{ color: "#b69af5" }}>you.</span>
          </Typography>

          <Typography
            component="p"
            sx={{
              margin: "16px auto 0",
              color: "#b5adbf",
              fontSize: "14px",
              lineHeight: 1.8,
              maxWidth: "380px",
              marginBottom: "32px",
            }}
          >
            Your confession has been submitted and will be posted shortly. Check
            our Instagram page for updates. Thank you for trusting this space
            with your thoughts and feelings. We appreciate your contribution to
            our community.
          </Typography>

          <Button
            type="button"
            fullWidth
            onClick={() => navigate("/", { replace: true })}
          >
            Exit
          </Button>
        </Card>
      </Box>
    </ThemeProvider>
  );
}