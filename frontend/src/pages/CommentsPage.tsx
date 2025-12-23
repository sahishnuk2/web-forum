import { useNavigate, useParams } from "react-router-dom";
import CommentsList from "../components/comments/CommentsList";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function CommentsPage() {
  const { post_id, topic_id } = useParams();
  const postId = Number(post_id);
  const topicId = Number(topic_id);
  const navigate = useNavigate();

  return (
    <>
      <div className="comments-post">
        {/* TODO: Fetch single post from backend -> need to implement from backend */}
        {/* <PostCard topic_id={topicId} id={postId} /> */}
      </div>
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
      <div className="comments-only">
        <CommentsList post_id={postId} />
      </div>
    </>
  );
}

export default CommentsPage;
