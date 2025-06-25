// src/utility/helper.jsx

export function getStoredToken() {
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
}
