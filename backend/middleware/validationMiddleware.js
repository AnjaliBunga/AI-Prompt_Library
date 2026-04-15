const validatePrompt = (req, res, next) => {
  const { title, content, complexity } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: "Title must be at least 3 characters" });
  }

  if (!content || content.trim().length < 20) {
    return res.status(400).json({ error: "Content must be at least 20 characters" });
  }

  const parsedComplexity = Number(complexity);
  if (Number.isNaN(parsedComplexity) || parsedComplexity < 1 || parsedComplexity > 10) {
    return res.status(400).json({ error: "Complexity must be between 1 and 10" });
  }

  req.body.complexity = parsedComplexity;
  next();
};

module.exports = { validatePrompt };
