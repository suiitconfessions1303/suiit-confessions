import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function VerificationPending() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const checkVerification = async () => {
      try {
        const response = await api.get("/confessions/session");

        if (response.data.active === true) {
          window.localStorage.removeItem("verification_pending");
          if (active) navigate("/confess", { replace: true });
        }
      } catch {
        // The verification link has not been used yet. Keep checking.
      }
    };

    checkVerification();
    const interval = window.setInterval(checkVerification, 2500);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [navigate]);

  return (
    <main className="page-shell">
      <section
        className="confession-card verification-waiting"
        aria-live="polite"
      >
        <p className="eyebrow">VERIFICATION PENDING</p>
        <h1>
          We are waiting <span>for you.</span>
        </h1>
        <p className="description">
          Open the verification link we sent to your inbox. As soon as your
          email is confirmed, this page will open your confession form.
        </p>

        <div className="loading-dots" aria-label="Checking verification status">
          <span />
          <span />
          <span />
        </div>

        <p className="waiting-note">
          Cannot find it? Check your spam or junk folder. The link expires in 5
          minutes.
        </p>
      </section>
    </main>
  );
}
