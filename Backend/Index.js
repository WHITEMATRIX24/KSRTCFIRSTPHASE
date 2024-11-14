// Import necessary modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./Routers/routers.js"; // Add the .js extension
import "./DataBase/Connection.js"; // Add the .js extension

// Configure environment variables
dotenv.config();

// Initialize Express server
const server = express();

// Middleware
server.use(cors());
server.use(express.json());
server.use(router);
server.use("/Uploads", express.static("./Uploads"));

// Define port
const PORT =4000|| process.env.PORT;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Health check route
server.get("/", (req, res) => {
  res.status(200).send("Server Health is good, Waiting for Request...");
});
