import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { colors } from "../theme";
import { formatDateTime } from "../utils";
import { downloadConfessionCards } from "../downloadConfession";

function Field({ label, value, wide = false }) {
  return (
    <Box sx={{ gridColumn: wide ? "1 / -1" : "auto", minWidth: 0 }}>
      <Typography sx={{ color: colors.muted, fontSize: "12px", mb: 0.25 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          color: colors.textSoft,
          fontSize: "13px",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function ConfessionDetail({ item, busy, onDelete, onClose }) {
  const meta = item.metadata || {};
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  async function handleDownload() {
    setDownloading(true);
    setDownloadError("");
    try {
      await downloadConfessionCards(item);
    } catch {
      setDownloadError("Couldn't create the card. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        width: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2.5, sm: 3.5 },
          py: 2,
          borderBottom: `1px solid ${colors.line}`,
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: colors.surface,
        }}
      >
        <Box>
          <Typography variant="h2" component="h2">
            Confession
          </Typography>
          <Typography
            component="time"
            sx={{ color: colors.muted, fontSize: "12px" }}
          >
            {formatDateTime(item.submittedAt)}
          </Typography>
        </Box>
        <IconButton
          aria-label="Close confession details"
          onClick={onClose}
          sx={{
            color: colors.muted,
            "&:hover": { color: colors.text, backgroundColor: colors.accentBg },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: 3,
          overflowY: "auto",
          minHeight: 0,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: "14px",
            border: `1px solid ${colors.line}`,
            backgroundColor: colors.surfaceDeep,
          }}
        >
          <Typography
            sx={{
              color: colors.text,
              fontFamily: '"Playfair Display", serif',
              fontSize: { xs: "17px", sm: "20px" },
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {item.message}
          </Typography>
        </Box>

        <Typography
          sx={{
            mt: 4,
            mb: 2,
            color: colors.text,
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          Submission details
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            gap: 2.5,
          }}
        >
          <Field
            label="Verified email"
            value={item.email || "Unavailable"}
            wide
          />
          <Field
            label="Browser"
            value={`${meta.browserName || "Unknown"} ${meta.browserVersion || ""}`.trim()}
          />
          <Field
            label="Operating system"
            value={`${meta.osName || "Unknown"} ${meta.osVersion || ""}`.trim()}
          />
          <Field label="Device" value={meta.deviceType || "Unknown"} />
          <Field label="Submission ID" value={item._id} />
          <Field
            label="User agent"
            value={meta.userAgent || "Unavailable"}
            wide
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1.5,
          px: { xs: 2.5, sm: 3.5 },
          py: 2,
          borderTop: `1px solid ${colors.line}`,
          flexShrink: 0,
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          backgroundColor: colors.surface,
        }}
      >
        {downloadError && (
          <Typography
            role="alert"
            sx={{ mr: "auto", color: colors.danger, fontSize: "12px" }}
          >
            {downloadError}
          </Typography>
        )}

        <Button
          variant="contained"
          disabled={downloading}
          onClick={handleDownload}
          sx={{
            backgroundColor: colors.accent,
            color: "#170e26",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#c0adff", boxShadow: "none" },
            "&.Mui-disabled": {
              backgroundColor: colors.accent,
              color: "#170e26",
              opacity: 0.5,
            },
          }}
        >
          {downloading ? "Preparing..." : "Download card"}
        </Button>

        <Button
          variant="outlined"
          color="error"
          disabled={busy}
          onClick={() => onDelete(item._id)}
        >
          {busy ? "Deleting..." : "Delete confession"}
        </Button>
      </Box>
    </Box>
  );
}
