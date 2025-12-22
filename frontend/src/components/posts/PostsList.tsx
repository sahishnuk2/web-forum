import type { Post } from "../../types";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { fetchPosts } from "../../services/api";

interface PostsListProp {
  topic_id: number;
}

function PostsList({ topic_id }: PostsListProp) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts(topic_id)
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts: ", error));
  }, [topic_id]);

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
          currentUserId={getCurrentUserId()}
          onDelete={() =>
            setPosts((prev) => prev.filter((p) => p.id !== post.id))
          }
        />
      ))}
    </div>
  );
}

export default PostsList;

// User must be present
function getCurrentUserId(): number {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const createdBy = user?.id;

  return createdBy;
}
