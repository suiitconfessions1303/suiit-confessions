import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import Logo from "../../../assets/favicon.png";
import { colors } from "../theme";

export const SIDEBAR_WIDTH = 248;

const navigationItems = [
  { label: "Inbox", path: "/admin/inbox", Icon: MailIcon },
  { label: "My profile", path: "/admin/profile", Icon: PersonIcon },
];

export default function Sidebar({ onLogout }) {
  return (
    <Box
      component="aside"
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        p: 3,
        borderRight: `1px solid ${colors.line}`,
        backgroundColor: "rgba(19, 15, 25, 0.8)",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 5 }}>
        <Box
          component="img"
          src={Logo}
          alt=""
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            backgroundColor: "#9b73ed",
            boxShadow: "0 0 0 3px #18131f, 0 8px 20px rgba(155,115,237,0.3)",
          }}
        />
        <Box>
          <Typography
            sx={{ fontWeight: 700, fontSize: "15px", color: colors.text }}
          >
            SUIIT Confessions
          </Typography>
          <Typography sx={{ fontSize: "12px", color: colors.muted }}>
            Admin Panel
          </Typography>
        </Box>
      </Stack>

      <Stack
        component="nav"
        aria-label="Admin navigation"
        spacing={0.75}
        sx={{ borderTop: `1px solid ${colors.line}`, pt: 2 }}
      >
        {navigationItems.map(({ label, path, Icon }) => (
          <Box
            key={path}
            component={NavLink}
            to={path}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 1.5,
              py: 1.25,
              borderRadius: "10px",
              color: colors.muted,
              textDecoration: "none",
              "&:hover": {
                color: colors.text,
                backgroundColor: colors.surfaceDeep,
              },
              "&.active": {
                color: colors.accentSoft,
                backgroundColor: colors.accentBg,
              },
            }}
          >
            <Icon fontSize="small" />
            <Typography
              component="span"
              sx={{ fontWeight: 700, fontSize: "14px" }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Box sx={{ flexGrow: 1 }} />
      <Button variant="outlined" color="primary" onClick={onLogout} fullWidth>
        Log out
      </Button>
    </Box>
  );
}
