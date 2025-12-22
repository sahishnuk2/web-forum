import { useNavigate, useParams } from "react-router-dom";
import PostsList from "../components/posts/PostsList";
import { Button } from "@mui/material";

function PostsPage() {
  const navigate = useNavigate();
  const { topic_id } = useParams();
  const topicId = Number(topic_id);

  return (
    <>
      <div className="top">
        <h1>Posts</h1>
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
          New Post
        </Button>
      </div>
      <PostsList topic_id={topicId} />
    </>
  );
}

export default PostsPage;
