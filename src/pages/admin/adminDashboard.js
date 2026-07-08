import { getAdmin, logoutAdmin } from "../../utils/adminAuth.js";
import { renderAdminOverview } from "./adminOverview.js";
import { renderAdminOrders } from "./adminOrders.js";
import { renderAdminMenu } from "./adminMenu.js";
import { getAllOrders } from "../../utils/orders.js";
import { renderAdminMessages } from './adminMessages.js';

export function renderAdminDashboard(container) {
  const admin = getAdmin();

  container.innerHTML = `
    <div style="display:flex;min-height:100vh;background:#f4f5f7;
                font-family:'Segoe UI',system-ui,sans-serif">

      <!-- Sidebar -->
      <aside id="admin-sidebar"
             style="width:240px;background:#0f0f0f;display:flex;
                    flex-direction:column;position:fixed;top:0;left:0;
                    bottom:0;z-index:100">

        <div style="display:flex;align-items:center;gap:0.75rem;
                    padding:1.5rem 1.25rem 1.25rem;
                    border-bottom:1px solid #1f1f1f;font-size:1.5rem">
          <span>🍽️</span>
          <div>
            <div style="color:#fff;font-weight:700;font-size:0.95rem">
              Tasty Bat-El
            </div>
            <div style="color:#C0392B;font-size:0.7rem;font-weight:600;
                        letter-spacing:1.5px;text-transform:uppercase">
              Admin Panel
            </div>
          </div>
        </div>

        <nav style="flex:1;padding:1rem 0.75rem;display:flex;
                    flex-direction:column;gap:0.25rem" id="sidebar-nav">
          ${navLink('overview',  '📊', 'Overview')}
          ${navLink('orders',    '📋', 'Orders')}
          ${navLink('menu',      '🍴', 'Menu Items')}
          ${navLink('messages',  '✉️',  'Messages')}
        </nav>

        <div style="padding:1rem 1.25rem;border-top:1px solid #1f1f1f;
                    display:flex;align-items:center;gap:0.75rem">
          <div style="width:34px;height:34px;background:#C0392B;color:#fff;
                      border-radius:50%;display:flex;align-items:center;
                      justify-content:center;font-weight:700;font-size:0.9rem;
                      flex-shrink:0">
            ${admin.name.charAt(0)}
          </div>
          <div style="flex:1;min-width:0">
            <div style="color:#eee;font-size:0.82rem;font-weight:600">
              ${admin.name}
            </div>
            <div style="color:#555;font-size:0.7rem;overflow:hidden;
                        text-overflow:ellipsis;white-space:nowrap">
              ${admin.email}
            </div>
          </div>
          <button id="sidebar-logout"
                  style="background:none;border:1px solid #333;color:#666;
                         border-radius:6px;padding:0.35rem 0.6rem;
                         cursor:pointer;font-size:0.9rem"
                  title="Logout">⏏</button>
        </div>
      </aside>

      <!-- Main content -->
      <main id="admin-main"
            style="margin-left:240px;flex:1;padding:2rem;min-height:100vh">
      </main>
    </div>`;

  // Logout
  document.getElementById("sidebar-logout").addEventListener("click", () => {
    logoutAdmin();
    window.location.hash = "#admin-login";
  });

  // Nav links
  document.getElementById("sidebar-nav").addEventListener("click", (e) => {
    const link = e.target.closest("[data-section]");
    if (link) {
      e.preventDefault();
      switchSection(link.dataset.section);
    }
  });

  switchSection("overview");
  updatePendingBadge();
}

function navLink(section, icon, label) {
  return `
    <a href="#" data-section="${section}"
       style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0.85rem;
              border-radius:8px;color:#888;text-decoration:none;font-size:0.9rem;
              font-weight:500;transition:background 0.15s,color 0.15s"
       class="sidebar-link">
      <span style="font-size:1.1rem;width:1.4rem;text-align:center">${icon}</span>
      <span>${label}</span>
      ${
        section === "orders"
          ? `<span id="pending-badge"
                 style="margin-left:auto;background:#C0392B;color:#fff;
                        font-size:0.7rem;font-weight:700;border-radius:10px;
                        padding:1px 7px;display:none"></span>`
          : ""
      }
    </a>`;
}

function switchSection(section) {
  // Highlight active link
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    const isActive = link.dataset.section === section;
    link.style.background = isActive ? "rgba(192,57,43,0.15)" : "";
    link.style.color = isActive ? "#e74c3c" : "#888";
  });

  const main = document.getElementById("admin-main");
  if (!main) return;

  if (section === "overview") renderAdminOverview(main);
  if (section === "orders") renderAdminOrders(main, updatePendingBadge);
  if (section === "menu") renderAdminMenu(main);
  if (section === 'messages') renderAdminMessages(main);
  updatePendingBadge();
}

function updatePendingBadge() {
  const count = getAllOrders().filter((o) =>
    ["Received", "Preparing"].includes(o.status),
  ).length;
  const badge = document.getElementById("pending-badge");
  if (!badge) return;
  badge.textContent = count || "";
  badge.style.display = count ? "inline-block" : "none";
}
