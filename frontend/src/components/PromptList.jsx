import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faGaugeHigh, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import { getCreatorName, isPromptOwner } from "../utils/userIdentity";

const getComplexityClass = (complexity) => {
  if (complexity <= 3) return "complexity-low";
  if (complexity <= 7) return "complexity-medium";
  return "complexity-high";
};

function PromptList({
  prompts,
  loading,
  error,
  currentUserEmail,
  onDeletePrompt,
  deletingPromptId,
  emptyMessage,
}) {
  if (loading) {
    return <p className="state">Loading prompts...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!prompts.length) {
    return <p className="state">{emptyMessage || "No prompts yet. Create one now."}</p>;
  }

  return (
    <div className="prompt-grid">
      {prompts.map((prompt) => {
        const isOwner = isPromptOwner(prompt.createdBy, currentUserEmail);
        const isDeleting = deletingPromptId === prompt._id;

        return (
          <article key={prompt._id} className="prompt-card">
            <Link to={`/prompts/${prompt._id}`} className="prompt-link">
              <h3>{prompt.title}</h3>
              <p>
                <FontAwesomeIcon icon={faGaugeHigh} className="inline-icon" /> Complexity:{" "}
                <span className={`complexity-badge ${getComplexityClass(prompt.complexity)}`}>
                  {prompt.complexity}
                </span>
              </p>
              <small>
                <FontAwesomeIcon icon={faCalendarDays} className="inline-icon" />{" "}
                {new Date(prompt.createdAt).toLocaleString()}
              </small>
              <p className="owner-row">
                <FontAwesomeIcon icon={faUser} className="inline-icon" /> Created by:{" "}
                {getCreatorName(prompt.createdBy)}
              </p>
            </Link>

            {isOwner && (
              <button
                type="button"
                className="delete-btn"
                onClick={() => onDeletePrompt(prompt._id)}
                disabled={isDeleting}
              >
                <FontAwesomeIcon icon={faTrashCan} className="inline-icon" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default PromptList;
