import { UnauthorisedError } from "../utils/Error";

const API_BASE_URL = import.meta.env["VITE_API_URL"];

async function handleResponse(response: Response, errorMessage: string) {
  if (!response.ok) {
    if (response.status == 401) {
      throw new UnauthorisedError("Session expired. Please log in again");
    }
    let backendError = errorMessage;
    try {
      const errorData = await response.json();
      backendError = errorData.error || errorMessage;
    } catch {
      // JSON parsing failed, use generic message
    }

    throw new Error(backendError);
  }

  return await response.json();
}

// Users
export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
    credentials: "include",
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

export const logOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Log Out failed");
  }

  return await response.json();
};

export const resetPassword = async (password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/changepassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      password,
    }),
  });

  return handleResponse(response, "Failed to reset password");
};

// Topics
export const fetchTopics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/topics`, {
    credentials: "include",
  });

  return handleResponse(response, "Failed to retrieve topics");
};

export const createTopic = async (title: string) => {
  const response = await fetch(`${API_BASE_URL}/api/topics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title,
    }),
  });

  return handleResponse(response, "Failed to create topic");
};

// Posts
export const fetchPosts = async (topicId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/posts?topic_id=${topicId}`,
    {
      credentials: "include",
    },
  );

  return handleResponse(response, "Failed to retrieve posts");
};

export const fetchSinglePost = async (post_id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/posts/${post_id}`, {
    credentials: "include",
  });

  return handleResponse(response, "Failed to retrieve post");
};

export const createPost = async (
  topic_id: number,
  title: string,
  content: string,
) => {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      topic_id,
      title,
      content,
    }),
  });

  return handleResponse(response, "Failed to create post");
};

export const editPost = async (
  post_id: number,
  title: string,
  content: string,
) => {
  const response = await fetch(`${API_BASE_URL}/api/posts/${post_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title,
      content,
    }),
  });

  return handleResponse(response, "Failed to edit post");
};

export const deletePost = async (post_id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/posts/${post_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse(response, "Failed to delete post");
};

export const createPostReaction = async (post_id: number, reaction: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/posts/${post_id}/reactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        reaction,
      }),
    },
  );

  return handleResponse(response, "Failed to react to post");
};

// Comments
export const fetchComments = async (post_id: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/comments?post_id=${post_id}`,
    {
      credentials: "include",
    },
  );

  return handleResponse(response, "Failed to retrieve comments");
};

export const fetchSingleComment = async (comment_id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/comments/${comment_id}`, {
    credentials: "include",
  });

  return handleResponse(response, "Failed to retrieve comment");
};

export const createComment = async (post_id: number, content: string) => {
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      post_id,
      content,
    }),
  });

  return handleResponse(response, "Failed to create comments");
};

export const editComment = async (comment_id: number, content: string) => {
  const response = await fetch(`${API_BASE_URL}/api/comments/${comment_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      content,
    }),
  });

  return handleResponse(response, "Failed to edit comment");
};

export const deleteComment = async (comment_id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/comments/${comment_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse(response, "Failed to delete comment");
};

export const createCommentReaction = async (
  comment_id: number,
  reaction: number,
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/comments/${comment_id}/reactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        reaction,
      }),
    },
  );

  return handleResponse(response, "Failed to react to comment");
};

// Validation

export const validate = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/validate`, {
    credentials: "include",
  });

  return handleResponse(response, "Not Authenticated");
};
