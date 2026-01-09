// User
export interface User {
  id: number;
  username: string;
  password?: string;
  created_at: string;
}

// Topic
export interface Topic {
  id: number;
  title: string;
  created_by: number;
  created_at: string;
}

// Post
export interface Post {
  id: number;
  topic_id: number;
  title: string;
  content: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  username: string;
  like_count: number;
  dislike_count: number;
  net_score: number;
  user_reaction: number | null;
}

// Comment
export interface Comment {
  id: number;
  post_id: number;
  content: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  username: string;
  like_count: number;
  dislike_count: number;
  net_score: number;
  user_reaction: number | null;
}
