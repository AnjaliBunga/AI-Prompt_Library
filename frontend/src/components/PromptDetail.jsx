import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faEye, faGaugeHigh, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import { getCreatorName, isPromptOwner } from "../utils/userIdentity";

const getComplexityClass = (complexity) => {
  if (complexity <= 3) return "complexity-low";
  if (complexity <= 7) return "complexity-medium";
  return "complexity-high";
};

function PromptDetail({ prompt, loading, error, currentUserEmail, onDeletePrompt, deleting }) {
  if (loading) return <p className="state">Loading prompt details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!prompt) return null;

  const isOwner = isPromptOwner(prompt.createdBy, currentUserEmail);

  return (
    <article className="detail-card">
      <h2>{prompt.title}</h2>
      <p className="meta-row">
        <FontAwesomeIcon icon={faGaugeHigh} className="inline-icon" /> Complexity:{" "}
        <span className={`complexity-badge ${getComplexityClass(prompt.complexity)}`}>
          {prompt.complexity}
        </span>
      </p>
      <p className="meta-row">
        <FontAwesomeIcon icon={faEye} className="inline-icon" /> Views: {prompt.view_count}
      </p>
      <p className="meta-row">
        <FontAwesomeIcon icon={faUser} className="inline-icon" /> Created by:{" "}
        {getCreatorName(prompt.createdBy)}
      </p>
      <p className="detail-content">{prompt.content}</p>
      <small>
        <FontAwesomeIcon icon={faCalendarDays} className="inline-icon" />{" "}
        {new Date(prompt.createdAt).toLocaleString()}
      </small>
      {isOwner && (
        <div className="detail-actions">
          <button type="button" className="delete-btn" onClick={onDeletePrompt} disabled={deleting}>
            <FontAwesomeIcon icon={faTrashCan} className="inline-icon" />
            {deleting ? "Deleting..." : "Delete Prompt"}
          </button>
        </div>
      )}
    </article>
  );
}

export default PromptDetail;
