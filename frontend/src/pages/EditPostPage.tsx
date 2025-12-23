import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editPost, fetchSinglePost } from "../services/api";
import "./CreateTopicPage.css";

function EditPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { topic_id, post_id } = useParams();
  const topicId = Number(topic_id);
  const postId = Number(post_id);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await fetchSinglePost(postId);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }
    loadPost();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const createdBy = user?.id;

    try {
      const data = await editPost(postId, title, content, createdBy);
      console.log(data); // to remove later
      navigate(`/topics/${topicId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="edit-post">
      <form onSubmit={handleSubmit}>
        <h1>Edit post</h1>
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
            <button type="submit">Edit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditPostPage;
