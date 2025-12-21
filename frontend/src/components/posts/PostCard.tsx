import { useNavigate } from "react-router-dom";
import type { Post } from "../../types";
import "./PostCard.css";

function PostCard({ id, topic_id, title, content, created_by }: Post) {
  const navigate = useNavigate();

  return (
    <div
      className="post-card"
      onClick={() => navigate(`/topics/${topic_id}/${id}`)}
    >
      <h2>{title}</h2>
      <p>{content}</p>
      id: {id} created_by: {created_by}
    </div>
  );
}

export default PostCard;
