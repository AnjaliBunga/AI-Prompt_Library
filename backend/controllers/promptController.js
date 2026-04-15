const mongoose = require("mongoose");
const Prompt = require("../models/Prompt");
const { redisClient, isRedisReady } = require("../config/redis");

const resolveCreatorName = (userEmail) => {
  if (userEmail === "test@promptlibrary.dev") {
    return "test user";
  }
  return userEmail;
};

const getPrompts = async (_req, res) => {
  try {
    const prompts = await Prompt.find({}, "title complexity createdAt createdBy").sort({
      createdAt: -1,
    });
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
};

const createPrompt = async (req, res) => {
  try {
    const { title, content, complexity } = req.body;
    const creatorEmail = (req.headers["x-user-email"] || "").toString().trim();
    const createdBy = resolveCreatorName(creatorEmail);

    if (!createdBy) {
      return res.status(401).json({ error: "User is not authenticated" });
    }

    const prompt = await Prompt.create({
      title: title.trim(),
      content: content.trim(),
      complexity,
      createdBy,
    });
    res.status(201).json(prompt);
  } catch (error) {
    res.status(500).json({ error: "Failed to create prompt" });
  }
};

const getPromptById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid prompt id" });
  }

  try {
    const prompt = await Prompt.findById(id);
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    let views = 0;
    if (isRedisReady()) {
      const key = `prompt:${id}:views`;
      views = await redisClient.incr(key);
    }

    res.json({
      ...prompt.toObject(),
      view_count: views,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompt" });
  }
};

const deletePromptById = async (req, res) => {
  const { id } = req.params;
  const currentUserEmail = (req.headers["x-user-email"] || "").toString().trim();
  const currentUserName = resolveCreatorName(currentUserEmail);

  if (!currentUserEmail) {
    return res.status(401).json({ error: "User is not authenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid prompt id" });
  }

  try {
    const prompt = await Prompt.findById(id);

    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    const isOwner = prompt.createdBy === currentUserEmail || prompt.createdBy === currentUserName;
    if (!isOwner) {
      return res.status(403).json({ error: "You can only delete your own prompts" });
    }

    await Prompt.findByIdAndDelete(id);
    res.json({ message: "Prompt deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete prompt" });
  }
};

module.exports = { getPrompts, createPrompt, getPromptById, deletePromptById };
