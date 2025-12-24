import type { Comment } from "../../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { deleteComment } from "../../services/api";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import ErrorMessage from "../common/ErrorMessage";

function CommentCard({
  id,
  content,
  created_by,
  updated_at,
  username,
  currentUserId,
  onDelete,
}: Comment & { currentUserId: number; onDelete: () => void }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setError("");
    navigate(`comments/${id}/edit`);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    setError("");
    try {
      await deleteComment(id, currentUserId);
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
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "left",
            color: "#006f80",
            paddingBottom: 1,
            textDecoration: "underline",
          }}
        >
          {username}
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "left", color: "#006f80", paddingBottom: 1 }}
        >
          {new Date(updated_at).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body2" sx={{ textAlign: "left" }}>
          {content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
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

export default CommentCard;
