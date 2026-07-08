import { getUser, logout } from "../utils/auth.js";
import { getCart } from "../utils/cart.js";

export function renderNavbar() {
  const root = document.getElementById("navbar-root");

  if (!root) {
    console.error("navbar-root not found");
    return;
  }

  let user = null;
  let cartCount = 0;

  try {
    user = getUser();
    cartCount = getCart().length;
  } catch (e) {
    console.warn("Storage read error:", e);
  }

  root.innerHTML = `
    <nav style="background:#1a1a1a;padding:0.75rem 0">
      <div class="container d-flex align-items-center justify-content-between flex-wrap gap-2">

        <!-- Brand -->
        <a href="#home"
           style="color:#C0392B;font-size:1.4rem;font-weight:700;
                  text-decoration:none;display:flex;align-items:center;gap:0.4rem">
          🍽️ Tasty Bat-El
        </a>

        <!-- Mobile toggle -->
        <button id="nav-toggle"
                style="background:none;border:1px solid rgba(255,255,255,0.3);
                       border-radius:4px;padding:0.35rem 0.6rem;cursor:pointer;
                       color:#fff;font-size:1.1rem;display:none"
                aria-label="Toggle menu">
          ☰
        </button>

        <!-- Nav links -->
        <div id="nav-links"
             style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap">

          <a href="#home"
             style="color:#fff;text-decoration:none;font-size:0.95rem;
                    font-weight:500">
            Menu
          </a>

          <a href="#cart"
             style="color:#fff;text-decoration:none;font-size:0.95rem;
                    font-weight:500;display:flex;align-items:center;gap:0.35rem">
            🛒 Cart
            ${
              cartCount > 0
                ? `<span style="background:#C0392B;color:#fff;font-size:0.7rem;
                              font-weight:700;border-radius:10px;padding:1px 7px">
                   ${cartCount}
                 </span>`
                : ""
            }
          </a>

          ${
            user
              ? `<span style="color:#ccc;font-size:0.88rem">
                 Hi, ${user.name}
               </span>
               <button id="nav-logout-btn"
                       style="background:none;border:1px solid #C0392B;
                              color:#C0392B;border-radius:6px;padding:0.3rem 0.85rem;
                              font-size:0.85rem;font-weight:600;cursor:pointer">
                 Logout
               </button>`
              : `<a href="#login"
                  style="background:#C0392B;color:#fff;border-radius:6px;
                         padding:0.35rem 1rem;font-size:0.88rem;font-weight:600;
                         text-decoration:none">
                 Login / Register
               </a>`
          }

        </div>
      </div>
    </nav>`;

  // Logout button
  document.getElementById("nav-logout-btn")?.addEventListener("click", () => {
    try {
      logout();
    } catch (e) {
      console.warn(e);
    }
    window.location.hash = "#home";
  });

  // Mobile toggle
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  function checkMobile() {
    if (window.innerWidth < 768) {
      toggle.style.display = "block";
      links.style.display = links.dataset.open === "true" ? "flex" : "none";
      links.style.flexDirection = "column";
      links.style.width = "100%";
      links.style.paddingTop = "0.75rem";
    } else {
      toggle.style.display = "none";
      links.style.display = "flex";
      links.style.flexDirection = "row";
      links.style.width = "auto";
      links.style.paddingTop = "0";
    }
  }

  toggle.addEventListener("click", () => {
    const isOpen = links.dataset.open === "true";
    links.dataset.open = isOpen ? "false" : "true";
    links.style.display = isOpen ? "none" : "flex";
  });

  checkMobile();
  window.addEventListener("resize", checkMobile);
}
