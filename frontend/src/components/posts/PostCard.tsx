import type { Post } from "../../types";
import "./PostCard.css";

function PostCard({ id, title, content, created_by }: Post) {
  return (
    <div className="post-card">
      <h2>{title}</h2>
      <p>{content}</p>
      id: {id} created_by: {created_by}
    </div>
  );
}

export default PostCard;
