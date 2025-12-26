import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import type { Comment } from "../../types";
import { fetchComments } from "../../services/api";
import getCurrentUserId, { handleApiError } from "../common/Functions";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";

interface CommentsListProp {
  post_id: number;
}

function CommentsList({ post_id }: CommentsListProp) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments(post_id)
      .then((data) => setComments(data))
      .catch((err) => {
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      });
  }, [post_id]);

  return (
    <div>
      {error && <ErrorMessage error={error} />}
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          {...comment}
          currentUserId={getCurrentUserId()}
          onDelete={() =>
            setComments((prev) => prev.filter((c) => c.id !== comment.id))
          }
        />
      ))}
    </div>
  );
}

export default CommentsList;
