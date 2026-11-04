import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Box, Card, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../assets/favicon.png";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const SESSION_SECONDS = 120;
const MAX_LENGTH = 5000;
const WARNING_THRESHOLD = 15;
const TEXTAREA_ROWS = 7;

/* ------------------------------------------------------------------ */
/*  Theme (shared look with VerifyEmail)                               */
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
    body1: { color: "#b5adbf", fontSize: "14px", lineHeight: 1.8 },
    body2: { color: "#92889e", fontSize: "12px", lineHeight: 1.7 },
  },
  palette: {
    primary: { main: "#a78bfa" },
    error: { main: "#713c4a" },
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
          "&:hover:not(:disabled)": {
            backgroundColor: "#c0adff",
            transform: "translateY(-1px)",
          },
          "&.Mui-disabled": {
            backgroundColor: "#a78bfa",
            color: "#170e26",
            opacity: 0.5,
            cursor: "not-allowed",
          },
        },
      },
    },
  },
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/* Plain textarea: fixed size via `rows`, scrolls inside itself */
const textareaSx = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  resize: "none",
  overflowY: "auto",
  padding: "14px 15px",
  border: "1px solid #40344b",
  borderRadius: "12px",
  backgroundColor: "#130f19",
  color: "#f5f2fa",
  fontFamily: "inherit",
  fontSize: "14px",
  lineHeight: 1.7,
  // Fluid height: comfortable on tall screens, compact on short/landscape ones.
  height: "clamp(130px, 28vh, 220px)",
  // 16px stops iOS Safari from zooming the page when the field is focused.
  "@media (max-width: 600px)": { fontSize: "16px" },
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  "&::placeholder": { color: "#777080", opacity: 1 },
  "&:focus": {
    borderColor: "#a78bfa",
    boxShadow: "0 0 0 3px rgba(167, 139, 250, 0.12)",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "#40344b transparent",
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#40344b",
    borderRadius: 6,
  },
  "&::-webkit-scrollbar-track": { background: "transparent" },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ConfessionForm() {
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(SESSION_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const expired = seconds <= 0;
  const warning = seconds <= WARNING_THRESHOLD;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (expired) {
      setError("Your session has expired. Please verify your email again.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/confessions", {
        message: message.trim(),
      });

      if (response.status === 201) {
        navigate("/thank-you", { replace: true, state: { submitted: true } });
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 401) {
        setSeconds(0);
        setError(
          serverMessage ||
            "Your session expired. Please verify your email again."
        );
      } else {
        setError(
          serverMessage || "Unable to submit your confession. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          // dvh = the visible height on phones (excludes the browser's address bar)
          "@supports (height: 100dvh)": { minHeight: "100dvh" },
          display: "grid",
          placeItems: "center",
          padding: "56px 18px 32px",
          WebkitTextSizeAdjust: "100%",
          background:
            "radial-gradient(ellipse at 15% 10%, #302044 0%, transparent 40%), radial-gradient(ellipse at 90% 85%, #21152f 0%, transparent 40%), #0e0b13",
          "@media (max-width: 480px)": { padding: "56px 12px 18px" },
          "@media (max-height: 520px) and (orientation: landscape)": {
            padding: "52px 18px 18px",
          },
        }}
      >
        {/* ---- Fixed-width container ---- */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 520,
            "@media (min-width: 1200px)": { maxWidth: 560 },
          }}
        >
          {/* ---- Logo badge ---- */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "-38px",
              marginBottom: "-30px",
              position: "relative",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="SUIIT Confessions logo"
              sx={{
                display: "block",
                width: 76,
                height: 76,
                "@media (max-width: 360px)": { width: 64, height: 64 },
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "#9b73ed",
                boxShadow:
                  "0 12px 32px rgba(155, 115, 237, 0.35), 0 0 0 6px #18131f",
              }}
            />
          </Box>

          {/* ---- Card ---- */}
          <Card
            sx={{
              padding: "34px 30px 26px",
              border: "1px solid #352a40",
              borderRadius: "24px",
              backgroundColor: "rgba(24, 19, 31, 0.92)",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
              textAlign: "center",
              "@media (max-width: 480px)": {
                padding: "26px 21px 20px",
                borderRadius: "19px",
              },
              "@media (max-width: 360px)": {
                padding: "24px 16px 18px",
                borderRadius: "16px",
              },
              "@media (min-width: 1200px)": { padding: "40px 36px 30px" },
            }}
          >

            <Typography variant="h1" component="h1">
              Let it <span style={{ color: "#b69af5" }}>out.</span>
            </Typography>

            <Typography
              component="p"
              sx={{
                margin: "14px auto 20px",
                color: "#b5adbf",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "360px",
              }}
            >
              Write what's on your mind. Take a breath and say it in your own
              words.
            </Typography>

            {/* ---- Timer ---- */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "6px 12px",
                marginBottom: "20px",
                padding: "12px 16px",
                border: "1px solid #49365f",
                borderRadius: "12px",
                backgroundColor: "#21182e",
                transition: "border-color 0.2s, background 0.2s",
                ...(warning && {
                  borderColor: "#9d4d5c",
                  backgroundColor: "#301922",
                }),
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: "#bcb0cc",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1.4px",
                }}
              >
                TIME REMAINING
              </Typography>
              <Typography
                component="strong"
                sx={{
                  color: warning ? "#ffb4c0" : "#c8b5ff",
                  fontSize: "22px",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTime(seconds)}
              </Typography>
            </Box>

            {/* ---- Body ---- */}
            {expired ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  color: "#ffb4c0",
                }}
              >
                <Typography
                  component="p"
                  sx={{ margin: 0, fontSize: "14px", lineHeight: 1.7 }}
                >
                  Your session has expired.
                </Typography>
                <Button
                  onClick={() => navigate("/", { replace: true })}
                  fullWidth
                >
                  Verify again
                </Button>
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  textAlign: "left",
                }}
              >
                <Typography
                  component="label"
                  htmlFor="confession"
                  sx={{ color: "#e7e0f0", fontSize: "13px", fontWeight: 600 }}
                >
                  Your confession
                </Typography>

                <Box
                  component="textarea"
                  id="confession"
                  placeholder="This is your space. Write freely..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={MAX_LENGTH}
                  rows={TEXTAREA_ROWS}
                  required
                  sx={textareaSx}
                />

                <Typography
                  component="div"
                  sx={{
                    color: "#92889e",
                    fontSize: "11px",
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {message.length}/{MAX_LENGTH} characters
                </Typography>

                <Button
                  type="submit"
                  disabled={loading || !message.trim()}
                  fullWidth
                >
                  {loading ? "Submitting..." : "Submit confession"}
                </Button>
              </Box>
            )}

            {/* ---- Error ---- */}
            {error && (
              <Box
                role="alert"
                sx={{
                  margin: "14px 0 0",
                  padding: "12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  overflowWrap: "anywhere",
                  border: "1px solid #713c4a",
                  backgroundColor: "#301922",
                  color: "#ffb4c0",
                  textAlign: "left",
                }}
              >
                {error}
              </Box>
            )}

          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}