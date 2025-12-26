import { type NavigateFunction } from "react-router-dom";
import { UnauthorisedError } from "../../utils/Error";

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

export function handleApiError(
  err: unknown,
  navigate: NavigateFunction
): string | null {
  if (err instanceof UnauthorisedError) {
    localStorage.removeItem("user");
    alert("Your session has expired. Please log in again.");
    navigate("/login");
    return null;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return "Unknown error occurred";
  }
}
