const User = require("../models/userModel.js");

// Get all users
const getUsers = (req, res) => {
  res.json([
    { id: 1, name: "Vivek" , email: "vivek@example.com"},
    { id: 2, name: "Siddharth", email: "siddharth@example.com" }
  ]);
};

// Create user
const createUser = (req, res) => {
  const { name, email } = req.body;

  res.json({
    message: "User created",
    user: { name, email }
  });
};

// Get user by ID
const getUserById = (req, res) => {
  const id = req.params.id;

  res.json({
    id: id,
    name: "Sample User"
  });
};

module.exports = {
  getUsers,
  createUser,
  getUserById
};