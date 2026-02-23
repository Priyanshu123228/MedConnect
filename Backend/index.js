require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const requestLogger = require("./middleware/requestLogger");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


require("./models/Pharmacy");

const medicineRoutes = require("./routes/medicineRoutes");
const priceRoutes = require("./routes/priceRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const expiryRoutes = require("./routes/expiryRoutes");

const app = express();

connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Security headers
app.use(helmet());

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing with limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Request logging
app.use(requestLogger);

// Root
app.get("/", (req, res) => {
  res.json({
    message: "MedConnect API",
    docs: "Available endpoints under /api",
    health: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "MedConnect backend" });
});

// API routes
app.use("/api/medicines", medicineRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/expiry-deals", expiryRoutes);

// 404 handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MedConnect backend running on port ${PORT}`);
});
