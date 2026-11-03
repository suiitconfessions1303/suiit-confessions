import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { startPending } from "../utils/verificationPending";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../assets/SUIIT Confession Campus Badge.png";

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
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: "28px",
      lineHeight: 1.25,
      color: "#f5f2fa",
      maxWidth: "310px",
      margin: 0,
    },
    body1: {
      color: "#b5adbf",
      fontSize: "14px",
      lineHeight: 1.8,
    },
    body2: {
      color: "#92889e",
      fontSize: "12px",
      lineHeight: 1.7,
    },
  },
  palette: {
    primary: { main: "#a78bfa" },
    error: { main: "#713c4a" },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#130f19",
            "& fieldset": { borderColor: "#40344b" },
            "&:hover fieldset": { borderColor: "#40344b" },
            "&.Mui-focused fieldset": {
              borderColor: "#a78bfa",
              boxShadow: "0 0 0 3px rgba(167, 139, 250, 0.12)",
            },
            "& input": {
              color: "#f5f2fa",
              fontSize: "14px",
              padding: "14px 15px",
            },
            "& input::placeholder": { color: "#777080", opacity: 1 },
          },
          "& .MuiInputLabel-root": {
            color: "#e7e0f0",
            fontSize: "13px",
            fontWeight: 600,
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#e7e0f0" },
        },
      },
    },
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
          "&:hover:not(:disabled)": {
            backgroundColor: "#c0adff",
            transform: "translateY(-1px)",
          },
          "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
          transition: "background 0.2s, transform 0.2s",
        },
      },
    },
  },
});

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNotice, setShowNotice] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Message shown when the user is sent back here after a failed/expired link.
  const [notice, setNotice] = useState(() => {
    const reason = new URLSearchParams(window.location.search).get(
      "verification",
    );

    if (reason === "expired" || location.state?.expired) {
      return "Your verification link expired. Please enter your email to get a new one.";
    }
    if (reason === "invalid") {
      return "That verification link is invalid or was already used. Please request a new one.";
    }
    if (reason === "error") {
      return "We couldn't verify your email. Please request a new link.";
    }
    return "";
  });

  // Remove ?verification=... from the address bar once it has been read.
  useEffect(() => {
    if (window.location.search.includes("verification=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      await api.post("/auth/request-verification", { email });
      startPending();
      navigate("/verification-pending", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send the verification email. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function closeNotice() {
    setShowNotice(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "32px 18px",
          background:
            "radial-gradient(ellipse at 15% 10%, #302044 0%, transparent 40%), radial-gradient(ellipse at 90% 85%, #21152f 0%, transparent 40%), #0e0b13",
          "@media (max-width: 480px)": { padding: "18px 12px" },
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "490px",
            padding: "0 38px 38px",
            border: "1px solid #352a40",
            borderRadius: "24px",
            backgroundColor: "rgba(24, 19, 31, 0.92)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
            textAlign: "center",
            overflow: "visible",
            "@media (max-width: 480px)": {
              padding: "0 21px 26px",
              borderRadius: "19px",
            },
          }}
        >
          {/* Logo centered above the card content. */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "-38px",
              marginBottom: "20px",
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
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "#9b73ed",
                boxShadow:
                  "0 12px 32px rgba(155, 115, 237, 0.35), 0 0 0 6px #18131f",
              }}
            />
          </Box>

          {/* Heading */}
          <Typography variant="h1" component="h1">
            Verify your <span style={{ color: "#b69af5" }}>email.</span>
          </Typography>

          <>
            <Typography
              component="p"
              sx={{
                margin: "16px auto 28px",
                color: "#b5adbf",
                fontSize: "14px",
                lineHeight: 1.8,
                maxWidth: "360px",
              }}
            >
              You're one step away from sending your confessions. Verify your
              university email to get started.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                textAlign: "left",
              }}
            >
              <Typography
                component="label"
                htmlFor="email"
                sx={{ color: "#e7e0f0", fontSize: "13px", fontWeight: 600 }}
              >
                Your email address
              </Typography>

              <TextField
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{ inputProps: { maxLength: 254 } }}
                autoComplete="email"
                required
                variant="outlined"
                fullWidth
              />

              <Button type="submit" disabled={loading} fullWidth>
                {loading ? "Sending link..." : "Send verification link"}
              </Button>
            </Box>

            {notice && !error && (
              <Box
                role="status"
                sx={{
                  margin: "16px 0 0",
                  padding: "12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  overflowWrap: "anywhere",
                  border: "1px solid #55406b",
                  backgroundColor: "#21182e",
                  color: "#d9ccff",
                  textAlign: "left",
                }}
              >
                {notice}
              </Box>
            )}

            {error && (
              <Box
                sx={{
                  margin: "16px 0 0",
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
          </>
        </Card>

        {/* Notice Modal */}
        <Modal
          open={showNotice}
          onClose={() => {}}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
              sx: {
                backgroundColor: "rgba(8, 6, 12, 0.78)",
                backdropFilter: "blur(8px)",
              },
            },
          }}
        >
          <Fade in={showNotice}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(100%, 430px)",
                padding: "34px 32px 30px",
                border: "1px solid #55406b",
                borderRadius: "20px",
                backgroundColor: "#18131f",
                boxShadow: "0 24px 90px rgba(0, 0, 0, 0.5)",
                outline: "none",
                "@keyframes noticeEnter": {
                  from: {
                    opacity: 0,
                    transform: "translate(-50%, -48%) scale(0.98)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translate(-50%, -50%) scale(1)",
                  },
                },
                animation: "noticeEnter 0.25s ease-out",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="student-notice-title"
            >
              <Typography
                component="p"
                sx={{
                  margin: "0 0 12px",
                  color: "#b49bdc",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                }}
              >
                A QUICK COMMUNITY NOTE
              </Typography>

              <Typography variant="h2" id="student-notice-title">
                Help us keep this space peaceful.
              </Typography>

              <Typography
                sx={{
                  margin: "16px 0 0",
                  color: "#b5adbf",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                We have seen people outside SUIIT misuse this space and send
                harmful messages to our students. Please verify that you are a
                SUIIT student before sharing.
              </Typography>

              <Typography
                sx={{
                  margin: "16px 0 0",
                  color: "#b5adbf",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                Your honesty helps us protect this community and keep it calm,
                respectful, and safe for everyone.
              </Typography>

              <Button
                onClick={closeNotice}
                fullWidth
                sx={{
                  marginTop: "24px",
                  minHeight: "48px",
                  padding: "13px 16px",
                  borderRadius: "12px",
                  backgroundColor: "#a78bfa",
                  color: "#170e26",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#c0adff" },
                }}
              >
                I understand
              </Button>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}