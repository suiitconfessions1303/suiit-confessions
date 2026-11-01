import { Box, Button, Stack, Typography } from "@mui/material";
import Logo from "../../../assets/favicon.png";
import { colors } from "../theme";
import LogoutIcon from '@mui/icons-material/Logout';

/* Shown only below the md breakpoint, replaces the sidebar. */
export default function TopBar({ onLogout }) {
  return (
    <Box
      component="header"
      sx={{
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.25,
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid ${colors.line}`,
        backgroundColor: "rgba(14, 11, 19, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
        <Box
          component="img"
          src={Logo}
          alt=""
          sx={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#9b73ed" }}
        />
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "15px", color: colors.text }}>
            SUIIT Confessions
          </Typography>
          <Typography sx={{ fontSize: "12px", color: colors.muted }}>Admin desk</Typography>
        </Box>
      </Stack>
      <Button variant="outlined" color="primary" size="small" onClick={onLogout}>
        <LogoutIcon />
      </Button>
    </Box>
  );
}
