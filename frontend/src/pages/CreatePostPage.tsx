import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost } from "../services/api";
import "./Pages.css";
import ErrorMessage from "../components/common/ErrorMessage";
import { emptyFields, handleApiError } from "../components/common/Functions";
import { Button, TextField } from "@mui/material";

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

    try {
      await createPost(topicId, title, content);
      navigate(`/topics/${topicId}`);
    } catch (err) {
      const errorMessage = handleApiError(err, navigate);
      if (errorMessage) {
        setError(errorMessage);
      }
    }
  }

  return (
    <div className="create">
      <form onSubmit={handleSubmit}>
        <h1>Create new post</h1>
        {error && <ErrorMessage error={error} />}

        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field-input"
        />

        <TextField
          id="filled-multiline-flexible"
          label="Content"
          multiline
          minRows={4}
          maxRows={10}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="field-input"
        />

        <div className="submissions">
          <Button type="button" onClick={() => navigate(`/topics/${topicId}`)}>
            Back
          </Button>
          <Button type="submit" disabled={emptyFields(title, content)}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostPage;
