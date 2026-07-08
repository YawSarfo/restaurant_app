import { saveUser, getUser } from "../utils/auth.js";

export function renderAuth(container, route) {
  const isLogin = route === "#login";

  container.innerHTML = `
    <div class="container py-5" style="max-width:460px">
      <h2 class="fw-bold mb-4 text-center">
        ${isLogin ? "Welcome Back" : "Create Account"}
      </h2>

      ${
        !isLogin
          ? `
        <div class="mb-3">
          <label class="form-label">Full Name</label>
          <input id="name" type="text" class="form-control"
                 placeholder="John Kamara" />
        </div>`
          : ""
      }

      <div class="mb-3">
        <label class="form-label">Email Address</label>
        <input id="email" type="email" class="form-control"
               placeholder="you@example.com" />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input id="password" type="password" class="form-control"
               placeholder="••••••••" />
      </div>

      <div id="auth-error" class="text-danger small mb-2 d-none"></div>

      <button id="auth-btn" class="btn btn-brand w-100">
        ${isLogin ? "Log In" : "Register"}
      </button>

      <p class="text-center mt-3 small">
        ${
          isLogin
            ? `No account? <a href="#register">Register here</a>`
            : `Already registered? <a href="#login">Log in</a>`
        }
      </p>
    </div>`;

  document.getElementById("auth-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorEl = document.getElementById("auth-error");

    if (!email || !password) {
      errorEl.textContent = "Please fill in all fields.";
      errorEl.classList.remove("d-none");
      return;
    }

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const found = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!found) {
        errorEl.textContent = "Invalid email or password.";
        errorEl.classList.remove("d-none");
        return;
      }
      saveUser(found);
    } else {
      const name = document.getElementById("name").value.trim();
      if (!name) {
        errorEl.textContent = "Name is required.";
        errorEl.classList.remove("d-none");
        return;
      }
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find((u) => u.email === email)) {
        errorEl.textContent = "Email already registered.";
        errorEl.classList.remove("d-none");
        return;
      }
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      saveUser(newUser);
    }

    window.location.hash = "#home";
  });
}
