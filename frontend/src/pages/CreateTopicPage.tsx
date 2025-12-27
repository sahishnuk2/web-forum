import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTopic } from "../services/api";
import "./Pages.css";
import ErrorMessage from "../components/common/ErrorMessage";
import { handleApiError } from "../components/common/Functions";
import { Button, TextField } from "@mui/material";

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
        {error && <ErrorMessage error={error} />}

        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field-input"
        />
        <div>
          <div className="submissions">
            <Button type="button" onClick={() => navigate("/topics")}>
              Back
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateTopicPage;
