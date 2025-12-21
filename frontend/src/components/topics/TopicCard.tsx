import { useNavigate } from "react-router-dom";
import type { Topic } from "../../types";
import "./TopicCard.css";

function TopicCard({ id, title, created_by }: Topic) {
  const navigate = useNavigate();

  return (
    <div className="topic-card" onClick={() => navigate(`/posts/${id}`)}>
      <h2>{title}</h2>
      {created_by}
    </div>
  );
}

export default TopicCard;
