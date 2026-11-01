
export async function sendVerificationEmail(email, token) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!/^[^\s@]+@suiit\.ac\.in$/.test(normalizedEmail)) {
    throw new Error("Only @suiit.ac.in emails are allowed.");
  }

  if (!process.env.EMAIL_API_URL || !process.env.EMAIL_API_SECRET) {
    throw new Error("Email API configuration is missing.");
  }

  const response = await fetch(process.env.EMAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EMAIL_API_SECRET}`,
    },
    body: JSON.stringify({
      email: normalizedEmail,
      token,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Email service failed with status ${response.status}`
    );
  }

  return result;
}
