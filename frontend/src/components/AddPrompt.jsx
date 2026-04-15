import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPrompt } from "../api/axios";

const initialForm = {
  title: "",
  content: "",
  complexity: 1,
};

function AddPrompt() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "complexity" ? Number(value) : value,
    }));
  };

  const validate = () => {
    if (formData.title.trim().length < 3) {
      return "Title must be at least 3 characters";
    }
    if (formData.content.trim().length < 20) {
      return "Content must be at least 20 characters";
    }
    if (formData.complexity < 1 || formData.complexity > 10) {
      return "Complexity must be between 1 and 10";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const prompt = await createPrompt(formData);
      navigate(`/prompts/${prompt._id}`);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to create prompt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Add New Prompt</h2>
      {error && <p className="error-message">{error}</p>}

      <label htmlFor="title">Title</label>
      <input id="title" name="title" value={formData.title} onChange={handleChange} />

      <label htmlFor="content">Content</label>
      <textarea
        id="content"
        name="content"
        rows="7"
        value={formData.content}
        onChange={handleChange}
      />

      <label htmlFor="complexity">Complexity (1-10)</label>
      <input
        id="complexity"
        name="complexity"
        type="number"
        min="1"
        max="10"
        value={formData.complexity}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Create Prompt"}
      </button>
    </form>
  );
}

export default AddPrompt;
