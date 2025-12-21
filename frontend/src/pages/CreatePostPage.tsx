import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost } from "../services/api";
import "./CreateTopicPage.css";

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { topic_id } = useParams();
  const topicId = Number(topic_id);

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
      const data = await createPost(topicId, title, content, createdBy);
      console.log(data); // to remove later
      navigate(`/topics/${topicId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <h1>Create new post</h1>
        <div className="input">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
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
              onClick={() => navigate(`/topics/${topicId}`)}
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

export default CreatePostPage;
