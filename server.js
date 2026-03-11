const express = require("express");
const userRoutes = require("./routes/userRoutes"); // import routes

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Example API route
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from backend" });
});

// 👇 connect user routes
app.use("/api/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});