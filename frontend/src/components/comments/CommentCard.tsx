import type { Comment } from "../../types";

function CommentCard({ content }: Comment) {
  return (
    <div className="comment-card">
      <p>{content}</p>
    </div>
  );
}

export default CommentCard;
