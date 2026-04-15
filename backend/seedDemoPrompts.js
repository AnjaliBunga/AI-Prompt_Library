const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Prompt = require("./models/Prompt");

dotenv.config();

const demoPrompts = [
  {
    title: "Cold Email Outreach Assistant",
    content:
      "Write a personalized cold outreach email for a SaaS founder targeting marketing agencies. Keep it concise, value-first, and include a clear CTA with two follow-up subject lines.",
    complexity: 4,
    createdBy: "test@promptlibrary.dev",
  },
  {
    title: "YouTube Script Generator",
    content:
      "Create a 5-minute YouTube script about beginner React performance optimization. Include hook, sections, examples, and a strong closing CTA while keeping language simple for new developers.",
    complexity: 6,
    createdBy: "test@promptlibrary.dev",
  },
  {
    title: "Product Requirement Breakdown",
    content:
      "Break this feature request into user stories, acceptance criteria, and edge cases. Output in markdown with priority labels and suggest a phased implementation plan for a two-week sprint.",
    complexity: 7,
    createdBy: "test@promptlibrary.dev",
  },
  {
    title: "Resume Bullet Rewriter",
    content:
      "Rewrite resume bullet points using action verbs, measurable outcomes, and ATS-friendly wording. Keep each bullet under 22 words and highlight leadership, delivery speed, and business impact.",
    complexity: 3,
    createdBy: "demo@promptlibrary.dev",
  },
  {
    title: "System Design Interview Coach",
    content:
      "Act as a senior interviewer and evaluate my system design answer for a URL shortener. Score architecture, scalability, trade-offs, and communication, then provide concrete improvement feedback.",
    complexity: 8,
    createdBy: "demo@promptlibrary.dev",
  },
];

const seedDemoPrompts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let inserted = 0;
    for (const prompt of demoPrompts) {
      const exists = await Prompt.findOne({
        title: prompt.title,
        createdBy: prompt.createdBy,
      });

      if (!exists) {
        await Prompt.create(prompt);
        inserted += 1;
      }
    }

    console.log(`Demo seeding complete. Inserted ${inserted} new prompts.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedDemoPrompts();
