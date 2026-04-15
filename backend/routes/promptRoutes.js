const express = require("express");
const {
  getPrompts,
  createPrompt,
  getPromptById,
  deletePromptById,
} = require("../controllers/promptController");
const { validatePrompt } = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", getPrompts);
router.post("/", validatePrompt, createPrompt);
router.get("/:id", getPromptById);
router.delete("/:id", deletePromptById);

module.exports = router;
