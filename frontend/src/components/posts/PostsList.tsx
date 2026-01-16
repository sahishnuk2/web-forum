import type { Post } from "../../types";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { fetchPosts } from "../../services/api";
import getCurrentUserId, { handleApiError } from "../common/Functions";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";
import { Box, CircularProgress, MenuItem, Select } from "@mui/material";

interface PostsListProp {
  topic_id: number;
}

function PostsList({ topic_id }: PostsListProp) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<
    "likes" | "net_score" | "newest" | "oldest"
  >("newest");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchPosts(topic_id)
      .then((data) => setPosts(data))
      .catch((err) => {
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
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

  const handleReactionUpdate = (
    postId: number,
    newLikeCount: number,
    newDislikeCount: number,
    newNetScore: number
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              like_count: newLikeCount,
              dislike_count: newDislikeCount,
              net_score: newNetScore,
            }
          : post
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
          <p>Loading posts</p>
        </Box>
      ) : (
        <div style={{ alignContent: "center" }}>
          {error && <ErrorMessage error={error} />}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 2,
              paddingRight: 2,
            }}
          >
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
              sx={{
                color: "#006f80",
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
                  color: "#006f80",
                },
              }}
            >
              <MenuItem value="net_score">Popular</MenuItem>
              <MenuItem value="likes">Most Liked</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </Box>
          {sortedPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onReactionUpdate={handleReactionUpdate}
              currentUserId={getCurrentUserId()}
              onDelete={() =>
                setPosts((prev) => prev.filter((p) => p.id !== post.id))
              }
              disableButtons={false}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default PostsList;
