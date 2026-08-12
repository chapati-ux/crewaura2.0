import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
  family: 4, // 👈 forces IPv4, avoids Render's ENETUNREACH/timeout on IPv6
});

// Verify connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer Error:", error);
  } else {
    console.log("✅ Mail Server is ready");
  }
});

export default transporter;