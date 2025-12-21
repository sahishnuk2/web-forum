import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment } from "../services/api";

function CreateCommentPage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { topic_id, post_id } = useParams();
  const topicId = Number(topic_id);
  const postId = Number(post_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const createdBy = user?.id;

    if (!createdBy) {
      navigate("/login");
      return;
    }

    try {
      const data = await createComment(postId, content, createdBy);
      console.log(data); // to remove later
      navigate(`/topics/${topicId}/${postId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="create-comment">
      <form onSubmit={handleSubmit}>
        <h1>Create new comment</h1>
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
            <button type="submit">Create</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateCommentPage;
