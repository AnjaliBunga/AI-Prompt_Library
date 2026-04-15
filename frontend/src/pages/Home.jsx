import { useEffect, useState } from "react";
import PromptList from "../components/PromptList";
import { deletePrompt, getPrompts } from "../api/axios";

function Home({ currentUserEmail }) {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingPromptId, setDeletingPromptId] = useState("");

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const data = await getPrompts();
      setPrompts(data);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleDeletePrompt = async (promptId) => {
    if (!window.confirm("Delete this prompt? This action cannot be undone.")) {
      return;
    }

    try {
      setError("");
      setDeletingPromptId(promptId);
      await deletePrompt(promptId);
      await fetchPrompts();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to delete prompt");
    } finally {
      setDeletingPromptId("");
    }
  };

  return (
    <section>
      <h2>Prompt Library</h2>
      <PromptList
        prompts={prompts}
        loading={loading}
        error={error}
        currentUserEmail={currentUserEmail}
        onDeletePrompt={handleDeletePrompt}
        deletingPromptId={deletingPromptId}
      />
    </section>
  );
}

export default Home;
