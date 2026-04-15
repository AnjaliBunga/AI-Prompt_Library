const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const promptRoutes = require("./routes/promptRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "AI Prompt Library API is running" });
});

app.use("/api/prompts", promptRoutes);
app.use("/api/auth", authRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const startServer = async () => {
  await connectDB();
  await User.updateOne(
    { email: "test@promptlibrary.dev" },
    { $setOnInsert: { name: "test user", email: "test@promptlibrary.dev", password: "Prompt@123" } },
    { upsert: true }
  );
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

startServer();
