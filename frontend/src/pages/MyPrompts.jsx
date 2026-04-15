import { useEffect, useMemo, useState } from "react";
import PromptList from "../components/PromptList";
import { deletePrompt, getPrompts } from "../api/axios";
import { isPromptOwner } from "../utils/userIdentity";

function MyPrompts({ currentUserEmail }) {
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

  const myPrompts = useMemo(
    () => prompts.filter((prompt) => isPromptOwner(prompt.createdBy, currentUserEmail)),
    [prompts, currentUserEmail]
  );

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
      <h2>My Prompts</h2>
      <PromptList
        prompts={myPrompts}
        loading={loading}
        error={error}
        currentUserEmail={currentUserEmail}
        onDeletePrompt={handleDeletePrompt}
        deletingPromptId={deletingPromptId}
        emptyMessage="You have not created any prompts yet."
      />
    </section>
  );
}

export default MyPrompts;
