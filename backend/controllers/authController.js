const User = require("../models/User");

const normalizeEmail = (email = "") => email.toString().trim().toLowerCase();

const registerUser = async (req, res) => {
  try {
    const name = (req.body.name || "").toString().trim();
    const email = normalizeEmail(req.body.email);
    const password = (req.body.password || "").toString();

    if (name.length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters." });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const user = await User.create({ name, email, password });
    return res.status(201).json({
      message: "Account created successfully.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create account." });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = (req.body.password || "").toString();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    return res.json({
      message: "Login successful.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to login." });
  }
};

module.exports = { registerUser, loginUser };
