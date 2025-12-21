const API_BASE_URL = import.meta.env["VITE_API_URL"];

// Users
export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  return await response.json();
};

export const signUp = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Sign Up failed");
  }

  return await response.json();
};

// Topics
export const fetchTopics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/topics`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to retrieve topics");
  }
  return await response.json();
};

export const createTopic = async (title: string, created_by: number) => {
  const response = await fetch(`${API_BASE_URL}/api/topics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      created_by,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create topic");
  }

  return await response.json();
};

// Posts
export const fetchPosts = async (topicId: number) => {
  const response = await fetch(`${API_BASE_URL}/api/posts?topic_id=${topicId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to retrieve posts");
  }
  return await response.json();
};

export const createPost = async (
  topic_id: number,
  title: string,
  content: string,
  created_by: number
) => {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic_id,
      title,
      content,
      created_by,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create post");
  }

  return await response.json();
};

// Comments
export const fetchComments = async (post_id: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/comments?post_id=${post_id}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to retrieve comments");
  }
  return await response.json();
};

export const createComment = async (
  post_id: number,
  content: string,
  created_by: number
) => {
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_id,
      content,
      created_by,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create comment");
  }
  return await response.json();
};
