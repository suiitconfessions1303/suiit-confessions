import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../assets/favicon.png";

/* ------------------------------------------------------------------ */
/*  Theme                                                              */
/* ------------------------------------------------------------------ */
const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: "clamp(32px, 7vw, 40px)",
      lineHeight: 1.2,
      letterSpacing: "-0.5px",
      color: "#f5f2fa",
      margin: 0,
    },
  },
  palette: {
    mode: "dark",
    primary: { main: "#a78bfa" },
    error: { main: "#ff8fa3" },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#161220",
            color: "#f5f2fa",
            fontSize: "14px",
            minHeight: "52px",
            transition:
              "background-color 0.2s, box-shadow 0.2s, border-color 0.2s",
            "& fieldset": {
              borderColor: "#3a2f47",
              transition: "border-color 0.2s",
            },
            "&:hover fieldset": {
              borderColor: "#4d3f5e",
            },
            "&.Mui-focused": {
              backgroundColor: "#1a1526",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#a78bfa",
              borderWidth: "1px",
              boxShadow: "0 0 0 3px rgba(167, 139, 250, 0.15)",
            },
            "& input": {
              padding: "16px 16px",
              "&::placeholder": {
                color: "#6b6275",
                opacity: 1,
              },
              // Hide the browser's native reveal icon (Edge) so there aren't two eyes
              "&::-ms-reveal, &::-ms-clear": { display: "none" },
              // Autofill without painting a separate box
              "&:-webkit-autofill": {
                WebkitTextFillColor: "#f5f2fa",
                caretColor: "#f5f2fa",
                transition: "background-color 9999s ease-in-out 0s",
              },
            },
          },
          "& .MuiInputLabel-root": {
            color: "#92889e",
            fontSize: "14px",
            fontWeight: 500,
            "&.Mui-focused": {
              color: "#c8b5ff",
              fontWeight: 600,
            },
          },
          "& .MuiInputLabel-outlined": {
            transform: "translate(16px, 16px) scale(1)",
          },
          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.85)",
            backgroundColor: "#161220",
            padding: "0 6px",
            borderRadius: "6px",
          },
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
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      await api.post("/admin/login", { username, password });
      navigate("/admin/inbox", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "56px 18px 32px",
          background:
            "radial-gradient(ellipse at 15% 10%, #302044 0%, transparent 40%), radial-gradient(ellipse at 90% 85%, #21152f 0%, transparent 40%), #0e0b13",
          "@media (max-width: 480px)": { padding: "56px 12px 18px" },
        }}
      >
        <Box sx={{ position: "relative", width: 440, maxWidth: "100%" }}>
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
              padding: "44px 30px 30px",
              border: "1px solid #352a40",
              borderRadius: "24px",
              backgroundColor: "rgba(24, 19, 31, 0.92)",
              backgroundImage: "none",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
              textAlign: "center",
              "@media (max-width: 480px)": {
                padding: "40px 21px 24px",
                borderRadius: "19px",
              },
            }}
          >
            <Typography variant="h1" component="h1">
              Admin <span style={{ color: "#b69af5" }}>Login</span>
            </Typography>

            <Typography
              component="p"
              sx={{
                margin: "12px auto 28px",
                color: "#b5adbf",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "320px",
              }}
            >
              Sign in to manage received confessions.
            </Typography>

            <Stack
              component="form"
              onSubmit={handleLogin}
              spacing={2.5}
              sx={{ textAlign: "left" }}
            >
              {/* Username */}
              <TextField
                id="admin-username"
                label="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                placeholder="Enter your username"
                required
                fullWidth
              />

              {/* Password */}
              <TextField
                id="admin-password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(event) => event.preventDefault()}
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          disableRipple
                          sx={{
                            minHeight: "auto",
                            minWidth: "auto",
                            width: "auto",
                            padding: "4px 6px",
                            mr: 0.5,
                            backgroundColor: "transparent",
                            color: "#92889e",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.6px",
                            textTransform: "uppercase",
                            borderRadius: "6px",
                            transition: "color 0.2s",
                            "&:hover:not(:disabled)": {
                              backgroundColor: "transparent",
                              color: "#c8b5ff",
                              transform: "none",
                            },
                            "&:focus-visible": {
                              backgroundColor: "transparent",
                              color: "#c8b5ff",
                              outline: "none",
                              boxShadow: "none",
                            },
                            "&:focus": {
                              outline: "none",
                              boxShadow: "none",
                            },
                          }}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {error && (
                <Alert
                  severity="error"
                  role="alert"
                  sx={{
                    border: "1px solid #713c4a",
                    backgroundColor: "#301922",
                    color: "#ffb4c0",
                    borderRadius: "10px",
                    fontSize: "13px",
                    overflowWrap: "anywhere",
                    "& .MuiAlert-icon": { color: "#ffb4c0" },
                  }}
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading || !username.trim() || !password}
                fullWidth
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
