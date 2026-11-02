import { Box, Typography } from "@mui/material";
import { colors } from "../theme";

function Stat({ label, value, suffix = "" }) {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 2, minWidth: 0 }}>
      <Typography
        sx={{ color: colors.muted, fontSize: "12px", fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          color: colors.text,
          fontFamily: '"Playfair Display", serif',
          fontSize: { xs: "26px", md: "32px" },
          fontWeight: 600,
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {suffix && (
          <Box
            component="span"
            sx={{ fontSize: "0.55em", color: colors.accentSoft, ml: 0.25 }}
          >
            {suffix}
          </Box>
        )}
      </Typography>
    </Box>
  );
}

/* One connected strip instead of four separate cards. */
export default function StatsStrip({ stats }) {
  const items = [
    { label: "Total received", value: stats.total },
    { label: "Today", value: stats.today },
    { label: "Last 7 days", value: stats.week },
    { label: "Sent from phones", value: stats.mobileShare, suffix: "%" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        border: `1px solid ${colors.line}`,
        borderRadius: "18px",
        backgroundColor: "rgba(24, 19, 31, 0.92)",
        overflow: "hidden",
        "& > *": {
          borderLeft: `1px solid ${colors.line}`,
          borderTop: `1px solid ${colors.line}`,
        },
        "& > :nth-of-type(-n+2)": {
          borderTop: { xs: "none", md: `1px solid ${colors.line}` },
        },
        "& > :nth-of-type(-n+4)": { borderTop: { md: "none" } },
        "& > :nth-of-type(odd)": {
          borderLeft: { xs: "none", md: `1px solid ${colors.line}` },
        },
        "& > :first-of-type": { borderLeft: "none" },
      }}
    >
      {items.map((s) => (
        <Stat key={s.label} {...s} />
      ))}
    </Box>
  );
}
