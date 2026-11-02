import { Box, Typography } from "@mui/material";
import { colors } from "../theme";
import { timeAgo } from "../utils";

export default function ConfessionListItem({ item, number, onSelect }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onSelect(item._id)}
      sx={{
        all: "unset",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        cursor: "pointer",
        p: 2.5,
        borderRadius: "16px",
        border: `1px solid ${colors.line}`,
        backgroundColor: "rgba(24, 19, 31, 0.92)",
        transition: "background-color 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: colors.lineStrong,
          backgroundColor: "#1c1626",
        },
        "&:focus-visible": {
          outline: `2px solid ${colors.accent}`,
          outlineOffset: 2,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography sx={{ color: colors.muted, fontSize: "12px" }}>
          {timeAgo(item.submittedAt)}
        </Typography>
        <Box
          component="span"
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: "999px",
            backgroundColor: colors.accentBg,
            color: colors.accentSoft,
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          #{number}
        </Box>
      </Box>

      {/* Message: always reserves 3 lines so every card matches */}
      <Typography
        sx={{
          mt: 1.5,
          mb: 2,
          minHeight: "4.95em",
          color: colors.text,
          fontSize: "14px",
          lineHeight: 1.65,
          overflowWrap: "anywhere",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {item.message}
      </Typography>

      {/* Footer pinned to the bottom */}
      <Box
        sx={{
          mt: "auto",
          pt: 1.5,
          borderTop: `1px solid ${colors.line}`,
          color: colors.accentSoft,
          fontSize: "13px",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Read full confession
      </Box>
    </Box>
  );
}
