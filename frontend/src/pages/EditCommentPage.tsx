import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editComment, fetchSingleComment } from "../services/api";
import "./Pages.css";
import { emptyFields, handleApiError } from "../components/common/Functions";
import ErrorMessage from "../components/common/ErrorMessage";
import { Button, CircularProgress, TextField } from "@mui/material";

function EditCommentPage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      }
    }
    loadComment();
  }, [commentId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await editComment(commentId, content);
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
    <div className="edit">
      <form onSubmit={handleSubmit}>
        <h1>Edit comment</h1>
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
            className="field-button"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={emptyFields(content) || loading}
            className="field-button"
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditCommentPage;
