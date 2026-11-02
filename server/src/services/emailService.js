export async function sendVerificationEmail(email, token) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!/^[^\s@]+@suiit\.ac\.in$/.test(normalizedEmail)) {
    throw new Error("Only @suiit.ac.in emails are allowed.");
  }

  if (!/^[a-f0-9]{64}$/.test(String(token || ""))) {
    throw new Error("Invalid verification token.");
  }

  const emailApiUrl = process.env.EMAIL_API_URL;
  const emailApiSecret = process.env.EMAIL_API_SECRET;

  if (!emailApiUrl || !emailApiSecret) {
    throw new Error("Email API configuration is missing.");
  }

  // Require HTTPS so the shared secret is not sent over plain HTTP.
  const parsedUrl = new URL(emailApiUrl);

  if (parsedUrl.protocol !== "https:") {
    throw new Error("Email API URL must use HTTPS.");
  }

  const response = await fetch(emailApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${emailApiSecret}`,
    },
    body: JSON.stringify({
      email: normalizedEmail,
      token,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Email service failed with status ${response.status}`,
    );
  }

  return result;
}
