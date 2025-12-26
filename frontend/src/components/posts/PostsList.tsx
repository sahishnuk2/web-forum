import type { Post } from "../../types";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { fetchPosts } from "../../services/api";
import getCurrentUserId, { handleApiError } from "../common/Functions";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";

interface PostsListProp {
  topic_id: number;
}

function PostsList({ topic_id }: PostsListProp) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts(topic_id)
      .then((data) => setPosts(data))
      .catch((err) => {
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      });
  }, []);

  return (
    <div style={{ alignContent: "center" }}>
      {error && <ErrorMessage error={error} />}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
          currentUserId={getCurrentUserId()}
          onDelete={() =>
            setPosts((prev) => prev.filter((p) => p.id !== post.id))
          }
          disableButtons={false}
        />
      ))}
    </div>
  );
}

export default PostsList;
