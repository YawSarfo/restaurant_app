export const getUser = () =>
  JSON.parse(localStorage.getItem("currentUser") || "null");

export const saveUser = (user) =>
  localStorage.setItem("currentUser", JSON.stringify(user));

export const logout = () => localStorage.removeItem("currentUser");
