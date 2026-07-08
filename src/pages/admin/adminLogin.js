import { loginAdmin } from "../../utils/adminAuth.js";

export function renderAdminLogin(container) {
  container.innerHTML = `
    <div style="min-height:100vh;background:#0f0f0f;display:flex;
                align-items:center;justify-content:center;padding:2rem">
      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;
                  padding:2.5rem;width:100%;max-width:420px">

        <div class="text-center mb-4">
          <div style="font-size:3rem">🍽️</div>
          <h1 style="color:#fff;font-size:1.5rem;font-weight:700;margin:0.5rem 0 0">
            Taste & Table
          </h1>
          <p style="color:#C0392B;font-size:0.75rem;font-weight:600;
                    letter-spacing:2px;text-transform:uppercase;margin:0">
            Admin Portal
          </p>
        </div>

        <div class="mb-3">
          <label style="color:#aaa;font-size:0.78rem;font-weight:600;
                        text-transform:uppercase;letter-spacing:0.5px;
                        display:block;margin-bottom:0.4rem">Email</label>
          <input id="admin-email" type="email"
                 style="width:100%;background:#111;border:1px solid #333;
                        border-radius:8px;color:#fff;padding:0.7rem 1rem;
                        font-size:0.95rem;outline:none;box-sizing:border-box"
                 value="admin@tasteandtable.com" />
        </div>

        <div class="mb-3">
          <label style="color:#aaa;font-size:0.78rem;font-weight:600;
                        text-transform:uppercase;letter-spacing:0.5px;
                        display:block;margin-bottom:0.4rem">Password</label>
          <input id="admin-password" type="password"
                 style="width:100%;background:#111;border:1px solid #333;
                        border-radius:8px;color:#fff;padding:0.7rem 1rem;
                        font-size:0.95rem;outline:none;box-sizing:border-box"
                 value="Admin@1234" />
        </div>

        <div id="login-error"
             style="display:none;background:rgba(192,57,43,0.15);
                    border:1px solid rgba(192,57,43,0.4);color:#e74c3c;
                    padding:0.6rem 1rem;border-radius:6px;
                    font-size:0.85rem;margin-bottom:1rem">
          Invalid email or password.
        </div>

        <button id="admin-login-btn"
                style="width:100%;background:#C0392B;color:#fff;border:none;
                       border-radius:8px;padding:0.8rem;font-size:1rem;
                       font-weight:600;cursor:pointer">
          Sign In to Dashboard
        </button>

        <p style="text-align:center;color:#555;font-size:0.78rem;margin-top:1.5rem">
          🔒 Restricted access — authorised personnel only
        </p>
      </div>
    </div>`;

  document.getElementById("admin-login-btn").addEventListener("click", () => {
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;
    const errorEl = document.getElementById("login-error");

    if (loginAdmin(email, password)) {
      window.location.hash = "#admin";
    } else {
      errorEl.style.display = "block";
    }
  });

  document.getElementById("admin-password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("admin-login-btn").click();
  });
}
