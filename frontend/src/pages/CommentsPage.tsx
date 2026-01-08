import { useNavigate, useParams } from "react-router-dom";
import CommentsList from "../components/comments/CommentsList";
import { Box, Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PostCard from "../components/posts/PostCard";
import { useEffect, useState } from "react";
import type { Post } from "../types";
import { fetchSinglePost } from "../services/api";
import ErrorMessage from "../components/common/ErrorMessage";
import getCurrentUserId, {
  handleApiError,
} from "../components/common/Functions";

function CommentsPage() {
  const { post_id, topic_id } = useParams();
  const postId = Number(post_id);
  const topicId = Number(topic_id);
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const data = await fetchSinglePost(postId);
        setPost(data);
      } catch (err) {
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [postId]);

  return (
    <>
      <div className="top">
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ color: "#006f80" }}
          onClick={() => navigate(`/topics/${topicId}`)}
        />
        <h1>Comments</h1>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate("create")}
          sx={{
            margin: 1,
            backgroundColor: "#006f80",
            "&:hover": { backgroundColor: "#005f6e" },
          }}
        >
          New Comment
        </Button>
      </div>
      <div className="comments-post">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#006f80" }} />
            <p>Loading post</p>
          </Box>
        ) : (
          post && (
            <PostCard
              key={postId}
              {...post}
              currentUserId={getCurrentUserId()}
              onDelete={null}
              disableButtons={true}
            />
          )
        )}
        {error && <ErrorMessage error={error} />}
      </div>
      <div className="comments-only">
        <CommentsList post_id={postId} />
      </div>
    </>
  );
}

export default CommentsPage;
