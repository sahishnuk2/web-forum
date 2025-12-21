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
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}

export default PostsList;
