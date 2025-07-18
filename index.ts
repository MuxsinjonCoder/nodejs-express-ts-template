import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db";
import userRoutes from "./src/routes/user.routes";

dotenv.config();

const app = express();

// Middleware – JSON body parsing
app.use(express.json());

// Project routes
app.use("/api/users", userRoutes);

// Connect MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
