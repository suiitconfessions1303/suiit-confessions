import { useState } from "react";
import { Box, Card, Chip, Divider, IconButton, Stack, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Logo from "../assets/favicon.png";
import theme, { colors, pageBackground } from "./AdminDashboard/theme";
import Sidebar from "./AdminDashboard/components/Sidebar";
import TopBar from "./AdminDashboard/components/TopBar";

const ADMIN = {
  username: "confessions_admin",
  password: import.meta.env.VITE_ADMIN_PASSWORD,
};

function DetailRow({ label, children }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 0.5, sm: 2 }}
      sx={{
        py: 2,
        alignItems: { sm: "center" },
        justifyContent: "space-between",
        minHeight: 64,
      }}
    >
      <Typography sx={{ color: colors.muted, fontSize: "13px", fontWeight: 500 }}>
        {label}
      </Typography>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
    </Stack>
  );
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogout() {
    try {
      await api.post("/admin/logout");
    } finally {
      navigate("/admin", { replace: true });
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", background: pageBackground }}>
        <Sidebar onLogout={handleLogout} />

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <TopBar onLogout={handleLogout} />

          <Box component="main" sx={{ p: { xs: 2, sm: 3, lg: 5 }, maxWidth: 760, mx: "auto" }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h1" component="h1">
                  My profile
                </Typography>
                <Typography sx={{ mt: 0.75, color: "#b5adbf", fontSize: "14px" }}>
                  Manage your administrator account.
                </Typography>
              </Box>

              <Card
                sx={{
                  border: `1px solid ${colors.line}`,
                  borderRadius: "20px",
                  backgroundColor: "rgba(24, 19, 31, 0.92)",
                  backgroundImage: "none",
                  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
                  overflow: "hidden",
                }}
              >
                {/* Identity */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2.5}
                  sx={{
                    p: { xs: 2.5, sm: 4 },
                    alignItems: "center",
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  <Box
                    component="img"
                    src={Logo}
                    alt="SUIIT Confessions logo"
                    sx={{
                      width: 84,
                      height: 84,
                      flexShrink: 0,
                      borderRadius: "50%",
                      objectFit: "cover",
                      backgroundColor: "#9b73ed",
                      boxShadow: "0 12px 32px rgba(155, 115, 237, 0.35), 0 0 0 5px #18131f",
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h2" component="h2">
                      {ADMIN.username}
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: colors.muted, fontSize: "14px" }}>
                      SUIIT Confessions
                    </Typography>
                    <Chip
                      label="Administrator"
                      size="small"
                      sx={{
                        mt: 1.5,
                        backgroundColor: colors.accentBg,
                        color: colors.accentSoft,
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    />
                  </Box>
                </Stack>

                <Divider sx={{ borderColor: colors.line }} />

                {/* Account details */}
                <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 1 }}>
                  <DetailRow label="Username">
                    <Typography sx={{ color: colors.text, fontSize: "15px", fontWeight: 600 }}>
                      {ADMIN.username}
                    </Typography>
                  </DetailRow>

                  <Divider sx={{ borderColor: colors.line }} />

                  <DetailRow label="Password">
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Typography
                        sx={{
                          color: colors.text,
                          fontSize: "15px",
                          fontWeight: 600,
                          letterSpacing: showPassword ? "0.2px" : "2px",
                          fontFamily: showPassword ? "inherit" : "monospace",
                          userSelect: showPassword ? "text" : "none",
                        }}
                      >
                        {showPassword ? ADMIN.password : "•".repeat(ADMIN.password.length)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        sx={{
                          color: colors.muted,
                          "&:hover": { color: colors.accentSoft, backgroundColor: "rgba(167, 139, 250, 0.1)" },
                          "&:focus-visible": { outline: `2px solid ${colors.accent}` },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Stack>
                  </DetailRow>
                </Box>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}