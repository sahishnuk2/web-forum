const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchTopics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/topics`);
  return await response.json();
};

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
