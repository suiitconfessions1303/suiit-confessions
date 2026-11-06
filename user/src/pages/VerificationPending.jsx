import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function VerificationPending() {
  const navigate = useNavigate();
  const [remainingMs, setRemainingMs] = useState(() =>
    getPendingRemainingMs(),
  );

  useEffect(() => {
    let active = true;

    const checkVerification = async () => {
      // The 5 minute window is over: reset everything and start again.
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
    <main className="page-shell">
      <section className="confession-card verification-waiting" aria-live="polite">
        <p className="eyebrow">VERIFICATION PENDING</p>
        <h1>We are waiting <span>for you.</span></h1>
        <p className="description">
          Open the verification link we sent to your Spam folder. As soon as your
          email is confirmed, this page will open your confession form.
        </p>

        <div className="loading-dots" aria-label="Checking verification status">
          <span />
          <span />
          <span />
        </div>

        <p className="waiting-note">
          Cannot find it? Check your spam or junk folder. The link expires in{" "}
          {formatTime(remainingMs)}.
        </p>

        <p className="waiting-note">
          <button
            type="button"
            onClick={useDifferentEmail}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#b69af5",
              cursor: "pointer",
              textDecoration: "underline",
              font: "inherit",
            }}
          >
            Use a different email
          </button>
        </p>
      </section>
    </main>
  );
}