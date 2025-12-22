import { useNavigate } from "react-router-dom";
import type { Post } from "../../types";
import "./PostCard.css";
import { deletePost } from "../../services/api";
import { useState } from "react";

function PostCard({
  id,
  topic_id,
  title,
  content,
  created_by,
  currentUserId,
  onDelete,
}: Post & { currentUserId: number; onDelete: () => void }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setError("");
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    setError("");
    try {
      const data = await deletePost(id, currentUserId);
      onDelete();
      console.log(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <>
      <div
        className="post-card"
        onClick={() => navigate(`/topics/${topic_id}/${id}`)}
      >
        <h2>{title}</h2>
        <p>{content}</p>
        id: {id} created_by: {created_by}
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
    </>
  );
}

export default PostCard;
