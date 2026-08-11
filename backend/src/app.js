import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
// Middleware
// app.use(cors());
app.use(express.json());

// Routes
app.use("/api/email", emailRoutes);

export default app;