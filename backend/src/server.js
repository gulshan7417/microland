const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { authMiddleware } = require("./middleware/authMiddleware");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// This approach can scale horizontally because each stateless backend instance
// opens its own connection to a managed MongoDB cluster. Load balancers can
// distribute traffic across many identical backend containers.
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/medicine_companion";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/medicines", authMiddleware, medicineRoutes);
app.use("/api/ai", authMiddleware, aiRoutes);

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Backend is stateless: we do not store any user session in memory,
// only rely on JWT tokens and database. This makes it easy to run
// many instances behind a load balancer or container orchestrator.
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

