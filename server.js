// server.js
const express = require('express');
const connectDB = require('./backend/config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./backend/routes/authRoutes');
const printRequestRoutes = require('./backend/routes/printRequestRoutes.js');
const trackingRoutes = require("./backend/routes/trackingRoutes.js");
const chefDashboardRoutes = require('./backend/routes/ChefdashboardRoutes.js');
const teacherRoutes = require("./backend/routes/teacherDashboardRoutes.js");
const adminRoutes = require('./backend/routes/adminRoutes.js');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`🔍 Incoming Request: ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/print-requests', printRequestRoutes);
app.use("/api/tracking", trackingRoutes);
app.use('/api/dashboard', chefDashboardRoutes);
app.use("/api/teacher", teacherRoutes);
app.use('/api/admin', adminRoutes);



app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start server after DB connection
const Port = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(Port, () => {
      console.log(`🚀 Server running on port ${Port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Server stopped.");
  process.exit();
});
