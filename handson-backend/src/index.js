require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const serverless = require("serverless-http");

const app = express();

// CORS configuration to allow all origins
const corsOptions = {
  origin: "*", // Allows all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
connectDB();

// Define your routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes")); // Event route
app.use('/api/teams',  require('./routes/teamRoutes'));

app.listen(5000, () => console.log("Server running on port 5000"));

// // Export the app for Vercel
// module.exports = app;
// module.exports.handler = serverless(app);
