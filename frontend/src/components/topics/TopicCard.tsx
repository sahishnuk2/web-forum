import type { Topic } from "../../types";
import "./TopicCard.css";

function TopicCard({ id, title, created_at, created_by }: Topic) {
  return (
    <div className="topic-card">
      <h2>{title}</h2>
      {id}
      {created_by}
      {created_at}
    </div>
  );
}

export default TopicCard;
