import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePrompt, getPrompt } from "../api/axios";
import PromptDetail from "../components/PromptDetail";

function Detail({ currentUserEmail }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        const data = await getPrompt(id);
        setPrompt(data);
      } catch (apiError) {
        setError(apiError.response?.data?.error || "Failed to load prompt");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  const handleDeletePrompt = async () => {
    if (!prompt || prompt.createdBy !== currentUserEmail) {
      return;
    }

    if (!window.confirm("Delete this prompt? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      await deletePrompt(prompt._id);
      navigate("/library");
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to delete prompt");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <Link to="/library" className="back-link">
        Back to list
      </Link>
      <PromptDetail
        prompt={prompt}
        loading={loading}
        error={error}
        currentUserEmail={currentUserEmail}
        onDeletePrompt={handleDeletePrompt}
        deleting={deleting}
      />
    </section>
  );
}

export default Detail;
