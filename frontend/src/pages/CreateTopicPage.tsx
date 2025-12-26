import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTopic } from "../services/api";
import "./CreateTopicPage.css";
import ErrorMessage from "../components/common/ErrorMessage";
import { handleApiError } from "../components/common/Functions";

function CreateTopicPage() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await createTopic(title);
      navigate("/topics");
    } catch (err) {
      const errorMessage = handleApiError(err, navigate);
      if (errorMessage) {
        setError(errorMessage);
      }
    }
  }

  return (
    <div className="create-topic">
      <form onSubmit={handleSubmit}>
        <h1>Create new topic</h1>
        <div className="input">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          {error && <ErrorMessage error={error} />}
          <div className="submissions">
            <button type="button" onClick={() => navigate("/topics")}>
              Back
            </button>
            <button type="submit">Create</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateTopicPage;
