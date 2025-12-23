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
      const data = await deleteComment(id, currentUserId);
      onDelete();
      console.log(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    // <div className="comment-card">
    //   <p>{content}</p>
    //   <div>
    //     {created_by === currentUserId && (
    //       <button onClick={handleEdit}>Edit</button>
    //     )}
    //     {created_by === currentUserId && (
    //       <button onClick={handleDelete}>Delete</button>
    //     )}
    //     {error && <p style={{ color: "red" }}>{error}</p>}
    //   </div>
    // </div>
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
