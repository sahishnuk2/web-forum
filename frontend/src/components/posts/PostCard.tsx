import { useNavigate } from "react-router-dom";
import type { Post } from "../../types";
import { deletePost } from "../../services/api";
import { useState } from "react";
import ErrorMessage from "../common/ErrorMessage";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";

function PostCard({
  id,
  topic_id,
  title,
  content,
  created_by,
  currentUserId,
  onDelete,
}: Post & { currentUserId: number; onDelete: () => void }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setError("");
    navigate(`${id}/edit`);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    setError("");
    try {
      await deletePost(id, currentUserId);
      onDelete();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <Card
      sx={{
        maxWidth: 800,
        width: "75%",
        margin: "16px auto",
        backgroundColor: "inherit",
        color: "inherit",
        boxShadow: 6,
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ textAlign: "left" }}>
          {title}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body2" sx={{ textAlign: "left" }}>
          {content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          variant="text"
          size="small"
          onClick={() => navigate(`/topics/${topic_id}/${id}`)}
          sx={{ color: "#006f80" }}
        >
          See comments
        </Button>
        {created_by === currentUserId && (
          <Box>
            <Button
              variant="contained"
              onClick={handleEdit}
              size="small"
              sx={{
                margin: 1,
                backgroundColor: "#006f80",
                "&:hover": { backgroundColor: "#005f6e" },
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleDelete}
              sx={{
                margin: 1,
                backgroundColor: "#006f80",
                "&:hover": { backgroundColor: "#005f6e" },
              }}
            >
              Delete
            </Button>
          </Box>
        )}
        {error && <ErrorMessage error={error} />}
      </CardActions>
    </Card>
  );
}

export default PostCard;
