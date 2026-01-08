import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment } from "../services/api";
import ErrorMessage from "../components/common/ErrorMessage";
import { emptyFields, handleApiError } from "../components/common/Functions";
import { Button, CircularProgress, TextField } from "@mui/material";

function CreateCommentPage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { topic_id, post_id } = useParams();
  const topicId = Number(topic_id);
  const postId = Number(post_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await createComment(postId, content);
      navigate(`/topics/${topicId}/${postId}`);
    } catch (err) {
      const errorMessage = handleApiError(err, navigate);
      if (errorMessage) {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create">
      <form onSubmit={handleSubmit}>
        <h1>Create new comment</h1>
        {error && <ErrorMessage error={error} />}
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
          <Button
            type="button"
            onClick={() => navigate(`/topics/${topicId}/${postId}`)}
          >
            Back
          </Button>
          <Button type="submit" disabled={emptyFields(content)}>
            {loading ? <CircularProgress sx={{ color: "white" }} /> : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateCommentPage;
