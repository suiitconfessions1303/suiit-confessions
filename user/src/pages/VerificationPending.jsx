import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import api from "../api";
import {
  clearPending,
  getPendingRemainingMs,
} from "../utils/verificationPending.js";

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const pulse = keyframes`
  0%, 100% { opacity: 0.25; transform: scale(0.9); }
  50%      { opacity: 1;    transform: scale(1.05); }
`;

export default function VerificationPending() {
  const navigate = useNavigate();
  const [remainingMs, setRemainingMs] = useState(() =>
    getPendingRemainingMs(),
  );

  useEffect(() => {
    let active = true;

    const checkVerification = async () => {
      if (getPendingRemainingMs() <= 0) {
        clearPending();
        if (active) navigate("/", { replace: true, state: { expired: true } });
        return;
      }

      try {
        const response = await api.get("/confessions/session");

        if (response.data.active === true) {
          clearPending();
          if (active) navigate("/confess", { replace: true });
        }
      } catch {
        // The verification link has not been used yet. Keep checking.
      }
    };

    checkVerification();
    const poll = window.setInterval(checkVerification, 2500);
    const tick = window.setInterval(() => {
      const left = getPendingRemainingMs();
      setRemainingMs(left);

      if (left <= 0) {
        clearPending();
        if (active) navigate("/", { replace: true, state: { expired: true } });
      }
    }, 1000);

    return () => {
      active = false;
      window.clearInterval(poll);
      window.clearInterval(tick);
    };
  }, [navigate]);

  function useDifferentEmail() {
    clearPending();
    navigate("/", { replace: true });
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        background:
          "radial-gradient(circle at 50% 20%, #2a1a4a 0%, #14081f 60%, #0a0410 100%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          borderRadius: "28px",
          p: { xs: 4, sm: 5 },
          color: "#ffffff",
          textAlign: "center",
          background:
            "linear-gradient(160deg, rgba(182,154,245,0.18), rgba(255,255,255,0.04))",
          border: "1px solid rgba(182,154,245,0.35)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          backdropFilter: "blur(14px)",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 100% 0%, rgba(182,154,245,0.25), transparent 55%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Floating envelope icon */}
        <Box
          sx={{
            position: "relative",
            width: 76,
            height: 76,
            mx: "auto",
            mb: 3,
            borderRadius: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            background:
              "linear-gradient(135deg, rgba(182,154,245,0.35), rgba(182,154,245,0.08))",
            border: "1px solid rgba(182,154,245,0.5)",
            boxShadow: "0 12px 30px rgba(182,154,245,0.25)",
            animation: `${pulse} 2.6s ease-in-out infinite`,
          }}
        >
          ✉️
        </Box>

        <Typography
          sx={{
            fontSize: 12,
            letterSpacing: "0.22em",
            fontWeight: 700,
            color: "#b69af5",
            mb: 1.5,
          }}
        >
          VERIFICATION PENDING
        </Typography>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 28, sm: 32 },
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 2,
            fontFamily: "inherit",
          }}
        >
          We are waiting{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(90deg, #b69af5, #e0d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            for you.
          </Box>
        </Typography>

        <Typography
          sx={{
            fontSize: 15,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.72)",
            mb: 4,
          }}
        >
          Open the verification link we sent to your email. As soon as your
          address is confirmed, this page will open your confession form.
        </Typography>

        {/* Animated loading dots */}
        <Stack
          direction="row"
          spacing={1.2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 3 }}
          aria-label="Checking verification status"
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#b69af5",
                animation: `${pulse} 1.3s ease-in-out infinite`,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </Stack>

        <Box
          sx={{
            borderRadius: "16px",
            p: 2.5,
            mb: 2.5,
            background: "rgba(182,154,245,0.08)",
            border: "1px dashed rgba(182,154,245,0.4)",
          }}
        >
          <Typography
            sx={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            The link only lands in your <strong>spam / junk</strong> folder.
            Please check there.
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 1.5 }}
          >
            <CircularProgress
              size={16}
              thickness={5}
              sx={{ color: "#b69af5" }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#b69af5",
                letterSpacing: "0.05em",
              }}
            >
              Link expires in {formatTime(remainingMs)}
            </Typography>
          </Stack>
        </Box>

        <Button
          type="button"
          onClick={useDifferentEmail}
          disableRipple
          sx={{
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            color: "#b69af5",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            padding: 0,
            minWidth: 0,
            fontFamily: "inherit",
            "&:hover": {
              background: "none",
              color: "#e0d4ff",
            },
          }}
        >
          Use a different email
        </Button>
      </Box>
    </Box>
  );
}