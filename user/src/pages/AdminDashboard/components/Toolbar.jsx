import { MenuItem, Select, Stack, Typography } from "@mui/material";
import { colors } from "../theme";

const selectSx = {
  minWidth: 130,
  borderRadius: "12px",
  backgroundColor: "#161220",
  color: colors.text,
  fontSize: "14px",
  fontWeight: 600,
  "& fieldset": { borderColor: "#3a2f47" },
  "&:hover fieldset": { borderColor: "#4d3f5e" },
  "&.Mui-focused fieldset": { borderColor: colors.accent, borderWidth: "1px" },
  "& .MuiSelect-icon": { color: colors.muted },
};

const menuPaperSx = {
  mt: 0.5,
  backgroundColor: colors.surface,
  border: `1px solid ${colors.line}`,
  borderRadius: "12px",
  backgroundImage: "none",
  "& .MuiMenuItem-root": {
    fontSize: "14px",
    color: colors.textSoft,
    "&:hover": { backgroundColor: "#21182e" },
    "&.Mui-selected": {
      backgroundColor: colors.accentBg,
      color: colors.accentSoft,
      fontWeight: 600,
    },
    "&.Mui-selected:hover": { backgroundColor: colors.accentBg },
  },
};

export default function Toolbar({ sort, onSort }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Typography variant="h2" component="h2">
        All confessions
      </Typography>

      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            color: colors.muted,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Sort by:
        </Typography>

        <Select
          size="small"
          value={sort}
          onChange={(event) => onSort(event.target.value)}
          sx={selectSx}
          inputProps={{ "aria-label": "Sort by" }}
          MenuProps={{ slotProps: { paper: { sx: menuPaperSx } } }}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
      </Stack>
    </Stack>
  );
}