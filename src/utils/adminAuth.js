const ADMIN_CREDENTIALS = {
  email: "admin@tastybatel.com",
  password: "Admin@1234",
};

export const getAdmin = () =>
  JSON.parse(sessionStorage.getItem("adminUser") || "null");

export function loginAdmin(email, password) {
  if (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const admin = { email, name: "Restaurant Admin", role: "admin" };
    sessionStorage.setItem("adminUser", JSON.stringify(admin));
    return admin;
  }
  return null;
}

export const logoutAdmin = () => sessionStorage.removeItem("adminUser");

export function requireAdmin() {
  if (!getAdmin()) {
    window.location.hash = "#admin-login";
    return false;
  }
  return true;
}
