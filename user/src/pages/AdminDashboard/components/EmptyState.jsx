import { CircularProgress, Stack, Typography } from "@mui/material";
import { colors } from "../theme";

export default function EmptyState({ title, text, loading = false }) {
  return (
    <Stack
      spacing={1}
      sx={{
        py: 6,
        px: 2,
        alignItems: "center",
        textAlign: "center",
        border: "1px dashed #40344b",
        borderRadius: "16px",
        backgroundColor: colors.surfaceDeep,
      }}
    >
      {loading && <CircularProgress size={26} thickness={4} sx={{ mb: 1 }} />}
      <Typography
        sx={{ color: colors.text, fontSize: "16px", fontWeight: 700 }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: colors.muted, fontSize: "13px", maxWidth: 300 }}>
        {text}
      </Typography>
    </Stack>
  );
}
