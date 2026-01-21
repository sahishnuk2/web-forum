import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import type { Comment } from "../../types";
import { fetchComments } from "../../services/api";
import getCurrentUserId, { handleApiError } from "../common/Functions";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";
import { Box, CircularProgress, MenuItem, Select, TextField } from "@mui/material";

interface CommentsListProp {
  post_id: number;
}

function CommentsList({ post_id }: CommentsListProp) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<
    "likes" | "net_score" | "newest" | "oldest"
  >("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchComments(post_id)
      .then((data) => setComments(data))
      .catch((err) => {
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      })
      .finally(() => setLoading(false));
  }, [post_id]);

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "likes":
        return b.like_count - a.like_count;
      case "newest":
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      case "oldest":
        return (
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        );
      case "net_score":
        return b.net_score - a.net_score;
      default:
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }
  });

  const filteredComments = [...sortedComments].filter((comment) => {
    return comment.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleReactionUpdate = (
    commentId: number,
    newLikeCount: number,
    newDislikeCount: number,
    newNetScore: number
  ) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              like_count: newLikeCount,
              dislike_count: newDislikeCount,
              net_score: newNetScore,
            }
          : comment
      )
    );
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "#006f80" }} />
          <p>Loading comments</p>
        </Box>
      ) : (
        <div>
          {error && <ErrorMessage error={error} />}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 2,
              paddingRight: 2,
              gap: 2,
            }}
          >
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#006f80",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#005f6e",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#006f80",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
                },
              }}
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#006f80",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#005f6e",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#006f80",
                },
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="net_score">Popular</MenuItem>
              <MenuItem value="likes">Most Liked</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </Box>
          {filteredComments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            filteredComments.map((comment) => (
              <CommentCard
                key={comment.id}
                {...comment}
                onReactionUpdate={handleReactionUpdate}
                currentUserId={getCurrentUserId()}
                onDelete={() =>
                  setComments((prev) => prev.filter((c) => c.id !== comment.id))
                }
              />
            ))
          )}
        </div>
      )}
    </>
  );
}

export default CommentsList;
