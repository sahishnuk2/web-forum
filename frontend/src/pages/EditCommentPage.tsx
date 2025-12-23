import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editComment, fetchSingleComment } from "../services/api";
import "./CreateTopicPage.css";

function EditCommentPage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { topic_id, comment_id, post_id } = useParams();
  const topicId = Number(topic_id);
  const postId = Number(post_id);
  const commentId = Number(comment_id);

  useEffect(() => {
    async function loadComment() {
      try {
        const data = await fetchSingleComment(commentId);
        setContent(data.content);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }
    loadComment();
  }, [commentId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const createdBy = user?.id;

    try {
      const data = await editComment(commentId, content, createdBy);
      console.log(data); // to remove later
      navigate(`/topics/${topicId}/${postId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="edit-comment">
      <form onSubmit={handleSubmit}>
        <h1>Edit comment</h1>
        <div className="input">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        </div>
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="submissions">
            <button
              type="button"
              onClick={() => navigate(`/topics/${topicId}/${postId}`)}
            >
              Back
            </button>
            <button type="submit">Edit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditCommentPage;
