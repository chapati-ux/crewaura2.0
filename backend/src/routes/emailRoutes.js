import express from "express";
import { sendEmail } from "../controllers/emailController.js";

const router = express.Router();

// POST /api/email
router.post("/", sendEmail);

export default router;