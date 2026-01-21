import { useNavigate, useParams } from "react-router-dom";
import PostsList from "../components/posts/PostsList";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function PostsPage() {
  const navigate = useNavigate();
  const { topic_id } = useParams();
  const topicId = Number(topic_id);

  return (
    <>
      <div className="top">
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ color: "#006f80" }}
            onClick={() => navigate("/topics")}
          />
        </div>
        <h1>Posts</h1>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 10,
          }}
        >
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
      </div>
      <PostsList topic_id={topicId} />
    </>
  );
}

export default PostsPage;
