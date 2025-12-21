import { useNavigate, useParams } from "react-router-dom";
import PostsList from "../components/posts/PostsList";

function PostsPage() {
  const navigate = useNavigate();
  const { topic_id } = useParams();
  const topicId = Number(topic_id);

  return (
    <>
      <div className="top">
        <h1>Posts</h1>
        <button onClick={() => navigate("create")}>New Post</button>
      </div>
      <PostsList topic_id={topicId} />
    </>
  );
}

export default PostsPage;
