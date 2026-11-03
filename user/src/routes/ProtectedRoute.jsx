import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { clearPending, isPending } from "../utils/verificationPending.js";


import { Box, CircularProgress, Paper, Typography } from "@mui/material";

function RouteLoading() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          "radial-gradient(ellipse at 15% 10%, #302044 0%, transparent 40%), radial-gradient(ellipse at 90% 85%, #21152f 0%, transparent 40%), #0e0b13",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 360,
          p: { xs: 4, sm: 5 },
          textAlign: "center",
          borderRadius: "24px",
          border: "1px solid #352a40",
          backgroundColor: "rgba(24, 19, 31, 0.92)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
        }}
      >
        <Box sx={{ mb: 2.5 }}>
          <CircularProgress
            size={36}
            thickness={4}
            aria-label="Checking your session"
            sx={{ color: "#a78bfa" }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#f5f2fa",
            mb: 1,
          }}
        >
          Checking your session
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#b5adbf",
            lineHeight: 1.7,
          }}
        >
          Please wait while we securely verify your access.
        </Typography>
      </Paper>
    </Box>
  );
}


export function SubmissionRoute({ children }) {
  const [allowed, setAllowed] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const handoffToken = new URLSearchParams(location.hash.slice(1)).get("session");

    const sessionCheck = handoffToken
      ? api.post("/confessions/session/activate", { token: handoffToken })
      : api.get("/confessions/session");

    sessionCheck
      .then((response) => {
        if (!active) return;

        const sessionActive = response.data.active === true;
        setAllowed(sessionActive);

        // Verified: the "waiting for email" state is finished.
        if (sessionActive) clearPending();

        if (handoffToken && sessionActive) {
          navigate("/confess", { replace: true });
        }
      })
      .catch(() => active && setAllowed(false));

    return () => {
      active = false;
    };
  }, [location.hash, navigate]);

  if (allowed === null) return <RouteLoading />;
  return allowed ? (
    children
  ) : (
    <Navigate
      to={isPending() ? "/verification-pending" : "/"}
      replace
    />
  );
}

export function ThankYouRoute({ children }) {
  const location = useLocation();

  return location.state?.submitted ? children : <Navigate to="/" replace />;
}

export function VerificationRoute({ children }) {
  const [hasSession, setHasSession] = useState(null);

  useEffect(() => {
    let active = true;

    // The backend redirects here with ?verification=expired|invalid|error
    // when a link fails. Reset the pending state so the email form shows.
    if (new URLSearchParams(window.location.search).has("verification")) {
      clearPending();
    }

    api
      .get("/confessions/session")
      .then(
        (response) => active && setHasSession(response.data.active === true),
      )
      .catch(() => active && setHasSession(false));

    return () => {
      active = false;
    };
  }, []);

  if (hasSession === null) return <RouteLoading />;
  if (hasSession) return <Navigate to="/confess" replace />;
  return isPending() ? (
    <Navigate to="/verification-pending" replace />
  ) : (
    children
  );
}

export function VerificationPendingRoute({ children }) {
  return isPending() ? children : <Navigate to="/" replace />;
}

export function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/admin/confessions")
      .then(() => active && setAllowed(true))
      .catch(() => active && setAllowed(false));

    return () => {
      active = false;
    };
  }, []);

  if (allowed === null) return <RouteLoading />;
  return allowed ? children : <Navigate to="/admin" replace />;
}

export function AdminLoginRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/admin/confessions")
      .then(() => active && setAuthenticated(true))
      .catch(() => active && setAuthenticated(false));

    return () => {
      active = false;
    };
  }, []);

  if (authenticated === null) return <RouteLoading />;
  return authenticated ? <Navigate to="/admin/inbox" replace /> : children;
}

export function PendingNavigationGuard({ children }) {
  const location = useLocation();
  const pending = isPending();
  const allowedPaths = ["/verification-pending", "/confess"];

  if (pending && !allowedPaths.includes(location.pathname)) {
    return <Navigate to="/verification-pending" replace />;
  }

  return children;
}