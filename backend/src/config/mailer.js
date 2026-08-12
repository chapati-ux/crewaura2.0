import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer Error:", error);
  } else {
    console.log("✅ Mail Server is ready");
  }
});

export default transporter;