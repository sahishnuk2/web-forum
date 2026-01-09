import { useNavigate } from "react-router-dom";
import type { Post } from "../../types";
import { createPostReaction, deletePost } from "../../services/api";
import { useState } from "react";
import ErrorMessage from "../common/ErrorMessage";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { handleApiError } from "../common/Functions";
import { ThumbDown, ThumbUp } from "@mui/icons-material";

function PostCard({
  id,
  topic_id,
  title,
  content,
  created_by,
  updated_at,
  username,
  like_count,
  dislike_count,
  currentUserId,
  user_reaction,
  onDelete,
  disableButtons,
}: Post & {
  currentUserId: number;
  onDelete: (() => void) | null;
  disableButtons: boolean;
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
    navigate(`${id}/edit`);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    setError("");
    try {
      await deletePost(id);
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      const errorMessage = handleApiError(err, navigate);
      if (errorMessage) {
        setError(errorMessage);
      }
    }
  }

  async function handleLike() {
    try {
      await createPostReaction(id, 1);

      if (userReaction === 1) {
        // Already liked, now unlike
        setLikesCount((p) => p - 1);
        setUserReaction(null);
        return;
      }
      if (userReaction === -1) {
        // Dislike -> Like
        setDislikesCount((p) => p - 1);
        setLikesCount((p) => p + 1);
        setUserReaction(1);
        return;
      }

      setLikesCount((p) => p + 1);
      setUserReaction(1);
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
      await createPostReaction(id, -1);

      if (userReaction === -1) {
        setDislikesCount((p) => p - 1);
        setUserReaction(null);
        return;
      }
      if (userReaction === 1) {
        setDislikesCount((p) => p + 1);
        setLikesCount((p) => p - 1);
        setUserReaction(-1);
        return;
      }

      setDislikesCount((p) => p + 1);
      setUserReaction(-1);
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
        border: "1px solid transparent",
        transition: "border-color 0.2s ease",
        "&:hover": {
          borderColor: "#006f80",
        },
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: 0,
            padding: 0,
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
        </Box>

        <Typography variant="h5" sx={{ textAlign: "left" }}>
          {title}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body2" sx={{ textAlign: "left" }}>
          {content}
        </Typography>
      </CardContent>
      {!disableButtons && (
        <CardActions
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate(`/topics/${topic_id}/${id}`)}
              sx={{ color: "#006f80" }}
            >
              See comments
            </Button>

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
      )}
    </Card>
  );
}

export default PostCard;
