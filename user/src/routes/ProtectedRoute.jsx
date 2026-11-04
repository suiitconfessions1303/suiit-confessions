import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { clearPending, isPending } from "../utils/verificationPending";


import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";

// Retry a request while the server is unreachable, timing out or answering
// with a 5xx error (typical while a sleeping Render server wakes up).
// A real answer below 500 (for example 401) means the server is awake,
// so it is returned to the caller immediately.
async function withRetry(request, signal, { attempts = 4, delayMs = 2000 } = {}) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await request(signal);
    } catch (error) {
      if (signal?.aborted) throw error;

      lastError = error;
      const status = error.response?.status;
      if (status && status < 500) throw error;

      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

const cardSx = {
  width: "100%",
  maxWidth: 360,
  p: { xs: 4, sm: 5 },
  textAlign: "center",
  borderRadius: "24px",
  border: "1px solid #352a40",
  backgroundColor: "rgba(24, 19, 31, 0.92)",
  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
};

const pageSx = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 2,
  py: 4,
  background:
    "radial-gradient(ellipse at 15% 10%, #302044 0%, transparent 40%), radial-gradient(ellipse at 90% 85%, #21152f 0%, transparent 40%), #0e0b13",
};

function RouteError({ onRetry }) {
  return (
    <Box component="main" sx={pageSx}>
      <Paper elevation={0} sx={cardSx}>
        <Typography
          variant="h6"
          sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#f5f2fa", mb: 1 }}
        >
          Can&apos;t reach the server
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#b5adbf", lineHeight: 1.7, mb: 3 }}
        >
          The server may be starting up or your connection dropped. Please
          try again in a moment.
        </Typography>
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{
            backgroundColor: "#a78bfa",
            color: "#170e26",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "12px",
            "&:hover": { backgroundColor: "#c0adff" },
          }}
        >
          Try again
        </Button>
      </Paper>
    </Box>
  );
}

function RouteLoading() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

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
          {slow
            ? "The server is waking up. This can take up to a minute, please keep this page open."
            : "Please wait while we securely verify your access."}
        </Typography>
      </Paper>
    </Box>
  );
}


export function SubmissionRoute({ children }) {
  const [allowed, setAllowed] = useState(null); // null | true | false | "error"
  const [retryKey, setRetryKey] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const handoffToken = new URLSearchParams(location.hash.slice(1)).get("session");

    const sessionCheck = withRetry(
      (signal) =>
        handoffToken
          ? api.post("/confessions/session/activate", { token: handoffToken }, { signal })
          : api.get("/confessions/session", { signal }),
      controller.signal,
    );

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
      .catch((error) => {
        if (!active) return;
        // 4xx = the server answered "no session". Anything else = unreachable.
        setAllowed(error.response && error.response.status < 500 ? false : "error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [location.hash, navigate, retryKey]);

  if (allowed === null) return <RouteLoading />;
  if (allowed === "error") {
    return (
      <RouteError
        onRetry={() => {
          setAllowed(null);
          setRetryKey((key) => key + 1);
        }}
      />
    );
  }
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
  const [hasSession, setHasSession] = useState(null); // null | true | false | "error"
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    // The backend redirects here with ?verification=expired|invalid|error
    // when a link fails. Reset the pending state so the email form shows.
    if (new URLSearchParams(window.location.search).has("verification")) {
      clearPending();
    }

    withRetry(
      (signal) => api.get("/confessions/session", { signal }),
      controller.signal,
    )
      .then(
        (response) => active && setHasSession(response.data.active === true),
      )
      .catch(() => active && setHasSession("error"));

    return () => {
      active = false;
      controller.abort();
    };
  }, [retryKey]);

  if (hasSession === null) return <RouteLoading />;
  if (hasSession === "error") {
    return (
      <RouteError
        onRetry={() => {
          setHasSession(null);
          setRetryKey((key) => key + 1);
        }}
      />
    );
  }
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