<<<<<<< HEAD

import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

try {
  await transporter.verify();
  console.log("Gmail SMTP connection successful!");
} catch (error) {
  console.error("Gmail SMTP error:", error.message);
}
=======

import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

try {
  await transporter.verify();
  console.log("Gmail SMTP connection successful!");
} catch (error) {
  console.error("Gmail SMTP error:", error.message);
}
>>>>>>> e84dfdfdaee441a71dbbe5ab2b3f71162b6deb50
