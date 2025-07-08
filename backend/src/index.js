import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connection.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import classRoutes from "./routes/class.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import parentRoutes from "./routes/parent.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import reportRoutes from "./routes/report.routes.js";
import planRoutes from "./routes/plan.routes.js";
import boxRoutes from "./routes/box.routes.js";
import documentRoutes from "./routes/document.routes.js";
import postRoutes from "./routes/post.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import lostItemRoutes from "./routes/lostItem.routes.js";
import healthRoutes from "./routes/health.routes.js";
import feeRoutes from "./routes/fee.routes.js";
import noteRoutes from "./routes/note.routes.js";
import driverRoutes from "./routes/driver.routes.js";

config();

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/educare_db?replicaSet=rs0";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Database connection
connectDB(MONGO_URI);

// Routes
app.get("/", (req, res) => {
  res.send("EduCare App Backend is Live!");
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", classRoutes);
app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);
app.use("/api", parentRoutes);
app.use("/api", adminRoutes);
app.use("/api", menuRoutes);
app.use("/api", reportRoutes);
app.use("/api", planRoutes);
app.use("/api", boxRoutes);
app.use("/api", documentRoutes);
app.use("/api", postRoutes);
app.use("/api", activityRoutes);
app.use("/api", lostItemRoutes);
app.use("/api", healthRoutes);
app.use("/api", feeRoutes);
app.use("/api", noteRoutes);
app.use("/api", driverRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle API errors with status codes
  if (err.isOperational) {
    const response = {
      success: false,
      message: err.message,
    };

    if (err.errors) {
      response.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle validation errors from express-validator
  if (err.type === "validation") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default error for unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// 404 handler - using a more compatible pattern
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`EduCare Backend listening at http://localhost:${PORT}`);
});
