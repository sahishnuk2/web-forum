export function getCurrentUserId(): number {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const createdBy = user?.id;

  return createdBy;
}

export default getCurrentUserId;

export function getCurrentUsername(): string {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const createdBy = user?.username;

  return createdBy;
}
