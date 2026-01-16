import type { Comment } from "../../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createCommentReaction, deleteComment } from "../../services/api";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import ErrorMessage from "../common/ErrorMessage";
import { handleApiError } from "../common/Functions";
import { ThumbDown, ThumbUp } from "@mui/icons-material";

function CommentCard({
  id,
  content,
  created_by,
  updated_at,
  username,
  like_count,
  dislike_count,
  user_reaction,
  currentUserId,
  onReactionUpdate,
  onDelete,
}: Comment & {
  currentUserId: number;
  onDelete: () => void;
  onReactionUpdate: (
    commentId: number,
    likes: number,
    dislikes: number,
    netScore: number
  ) => void;
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [likesCount, setLikesCount] = useState(like_count);
  const [dislikesCount, setDislikesCount] = useState(dislike_count);
  const [userReaction, setUserReaction] = useState<number | null>(
    user_reaction
  );

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
      await deleteComment(id);
      onDelete();
    } catch (err) {
      const errorMessage = handleApiError(err, navigate);
      if (errorMessage) {
        setError(errorMessage);
      }
    }
  }

  async function handleLike() {
    try {
      await createCommentReaction(id, 1);

      if (userReaction === 1) {
        const newLikes = likesCount - 1;
        setLikesCount(newLikes);
        setUserReaction(null);
        onReactionUpdate(id, newLikes, dislikesCount, newLikes - dislikesCount);
        return;
      }
      if (userReaction === -1) {
        const newLikes = likesCount + 1;
        const newDislikes = dislikesCount - 1;
        setDislikesCount(newDislikes);
        setLikesCount(newLikes);
        setUserReaction(1);
        onReactionUpdate(id, newLikes, newDislikes, newLikes - newDislikes);
        return;
      }

      const newLikes = likesCount + 1;
      setLikesCount(newLikes);
      setUserReaction(1);
      onReactionUpdate(id, newLikes, dislikesCount, newLikes - dislikesCount);
      return;
    } catch (err) {
      const errorMessage = handleApiError(err, navigate);
      if (errorMessage) {
        setError(errorMessage);
      }
    }
  }

  async function handleDislike() {
    try {
      await createCommentReaction(id, -1);

      if (userReaction === -1) {
        const newDislikes = dislikesCount - 1;
        setDislikesCount(newDislikes);
        setUserReaction(null);
        onReactionUpdate(id, likesCount, newDislikes, likesCount - newDislikes);
        return;
      }
      if (userReaction === 1) {
        const newDislikes = dislikesCount + 1;
        const newLikes = likesCount - 1;
        setDislikesCount(newDislikes);
        setLikesCount(newLikes);
        setUserReaction(-1);
        onReactionUpdate(id, newLikes, newDislikes, newLikes - newDislikes);
        return;
      }

      const newDislikes = dislikesCount + 1;
      setDislikesCount(newDislikes);
      setUserReaction(-1);
      onReactionUpdate(id, likesCount, newDislikes, likesCount - newDislikes);
    } catch (err) {
      const errorMessage = handleApiError(err, navigate);
      if (errorMessage) {
        setError(errorMessage);
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
        boxShadow: 4,
        borderRadius: 2,
        border: "1px solid transparent",
        transition: "border-color 0.2s ease",
        "&:hover": {
          borderColor: "#006f80",
        },
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
          {new Date(updated_at).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body2" sx={{ textAlign: "left" }}>
          {content}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Box
          sx={{ display: "flex", gap: 0.5, alignItems: "center", ml: 1 }}
        >
          <IconButton
            onClick={handleLike}
            className={userReaction === 1 ? "active" : ""}
            size="small"
            sx={{
              color: "inherit",
              "&:hover": { backgroundColor: "rgba(0, 111, 128, 0.1)" },
              "&.active": { color: "#006f80" },
            }}
          >
            <ThumbUp fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ minWidth: 20, textAlign: "center" }}
          >
            {likesCount}
          </Typography>

          <IconButton
            onClick={handleDislike}
            className={userReaction === -1 ? "active" : ""}
            size="small"
            sx={{
              color: "inherit",
              "&:hover": { backgroundColor: "rgba(0, 111, 128, 0.1)" },
              "&.active": { color: "#006f80" },
            }}
          >
            <ThumbDown fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ minWidth: 20, textAlign: "center" }}
          >
            {dislikesCount}
          </Typography>
        </Box>

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
