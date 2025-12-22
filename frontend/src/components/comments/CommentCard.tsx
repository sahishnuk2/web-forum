import type { Comment } from "../../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { deleteComment } from "../../services/api";

function CommentCard({
  id,
  content,
  created_by,
  currentUserId,
  onDelete,
}: Comment & { currentUserId: number; onDelete: () => void }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setError("");
    navigate(`comments/${id}/edit`);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    setError("");
    try {
      const data = await deleteComment(id, currentUserId);
      onDelete();
      console.log(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="comment-card">
      <p>{content}</p>
      <div>
        {created_by === currentUserId && (
          <button onClick={handleEdit}>Edit</button>
        )}
        {created_by === currentUserId && (
          <button onClick={handleDelete}>Delete</button>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default CommentCard;
