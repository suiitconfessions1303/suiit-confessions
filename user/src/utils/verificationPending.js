// Tracks the "waiting for the email link" state in localStorage.
// The stored value is the expiry timestamp (ms), so a stale flag can
// never keep a user stuck on the Verification Pending page.

const KEY = "verification_pending";

// Keep in sync with the 5 minute expiry in server/src/routes/authRoutes.js
export const VERIFICATION_WINDOW_MS = 5 * 60 * 1000;

export function startPending() {
  try {
    window.localStorage.setItem(
      KEY,
      String(Date.now() + VERIFICATION_WINDOW_MS),
    );
  } catch {
    // Storage unavailable (private mode etc.) - nothing to track.
  }
}

export function clearPending() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// Milliseconds left before the link expires (0 when not pending or expired).
// An expired or legacy ("true") value is cleared automatically.
export function getPendingRemainingMs() {
  try {
    const expiresAt = Number(window.localStorage.getItem(KEY));

    if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
      clearPending();
      return 0;
    }

    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      clearPending();
      return 0;
    }

    return remaining;
  } catch {
    return 0;
  }
}

export function isPending() {
  return getPendingRemainingMs() > 0;
}
