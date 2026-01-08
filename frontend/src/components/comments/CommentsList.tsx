import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import type { Comment } from "../../types";
import { fetchComments } from "../../services/api";
import getCurrentUserId, { handleApiError } from "../common/Functions";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";
import { Box, CircularProgress } from "@mui/material";

interface CommentsListProp {
  post_id: number;
}

function CommentsList({ post_id }: CommentsListProp) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchComments(post_id)
      .then((data) => setComments(data))
      .catch((err) => {
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      })
      .finally(() => setLoading(false));
  }, [post_id]);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "#006f80" }} />
          <p>Loading comments</p>
        </Box>
      ) : (
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
      )}
    </>
  );
}

export default CommentsList;
