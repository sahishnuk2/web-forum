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
