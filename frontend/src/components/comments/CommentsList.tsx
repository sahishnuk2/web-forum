import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import type { Comment } from "../../types";
import { fetchComments } from "../../services/api";

interface CommentsListProp {
  post_id: number;
}

function CommentsList({ post_id }: CommentsListProp) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments(post_id)
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments: ", error));
  }, [post_id]);

  return (
    <div>
      {comments.map((comment) => (
        <CommentCard key={comment.id} {...comment} />
      ))}
    </div>
  );
}

export default CommentsList;
