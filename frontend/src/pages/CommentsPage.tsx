import { useNavigate, useParams } from "react-router-dom";
import CommentsList from "../components/comments/CommentsList";

function CommentsPage() {
  const { post_id } = useParams();
  const postId = Number(post_id);
  const navigate = useNavigate();

  return (
    <>
      <div className="comments-post">
        {/* TODO: Fetch single post from backend -> need to implement from backend */}
        {/* <PostCard topic_id={topicId} id={postId} /> */}
      </div>
      <div className="top">
        <h1>Comments</h1>
        <button onClick={() => navigate("create")}>New Comment</button>
      </div>
      <div className="comments-only">
        <CommentsList post_id={postId} />
      </div>
    </>
  );
}

export default CommentsPage;
