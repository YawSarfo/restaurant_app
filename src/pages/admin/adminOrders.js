import {
  getAllOrders,
  updateOrderStatus,
  ORDER_STATUSES,
} from "../../utils/orders.js";

export function renderAdminOrders(container, onUpdate) {
  let filterStatus = "All";
  let searchQuery = "";

  function render() {
    const all = getAllOrders();
    const shown = all.filter((o) => {
      const matchStatus = filterStatus === "All" || o.status === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        o.user?.toLowerCase().includes(q) ||
        String(o.id).includes(q) ||
        o.address?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });

    container.innerHTML = `
      <h2 style="font-size:1.6rem;font-weight:700;color:#1a1a1a;margin:0 0 0.25rem">
        Orders
      </h2>
      <p style="color:#888;font-size:0.85rem;margin:0 0 1.25rem">
        ${all.length} total
      </p>

      <!-- Search -->
      <input id="order-search" type="text"
             style="width:100%;padding:0.65rem 1rem;border:1px solid #e0e0e0;
                    border-radius:8px;font-size:0.9rem;outline:none;
                    margin-bottom:0.75rem;background:#fff;box-sizing:border-box"
             placeholder="Search by customer, address or order ID…"
             value="${searchQuery}" />

      <!-- Status filters -->
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.25rem">
        ${["All", ...ORDER_STATUSES.map((s) => s.value)]
          .map(
            (s) => `
          <button class="filter-btn"
                  data-status="${s}"
                  style="border-radius:20px;padding:0.3rem 0.85rem;
                         font-size:0.78rem;font-weight:600;cursor:pointer;
                         border:1px solid ${filterStatus === s ? "#C0392B" : "#ddd"};
                         background:${filterStatus === s ? "#C0392B" : "#fff"};
                         color:${filterStatus === s ? "#fff" : "#555"}">
            ${s}
          </button>`,
          )
          .join("")}
      </div>

      <!-- Order cards -->
      <div style="display:flex;flex-direction:column;gap:1rem">
        ${
          shown.length === 0
            ? `<div style="background:#fff;border:1px solid #eee;border-radius:12px;
                         padding:3rem;text-align:center;color:#aaa">
               ${
                 all.length === 0
                   ? "No orders yet."
                   : "No orders match your filter."
               }
             </div>`
            : shown.map((o) => orderCard(o)).join("")
        }
      </div>`;

    // Search handler
    document.getElementById("order-search").addEventListener("input", (e) => {
      searchQuery = e.target.value;
      render();
    });

    // Filter buttons
    container.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterStatus = btn.dataset.status;
        render();
      });
    });

    // Update status buttons
    container.querySelectorAll(".update-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const select = container.querySelector(`.status-sel[data-id="${id}"]`);
        updateOrderStatus(id, select.value);
        btn.textContent = "✓ Saved";
        btn.style.background = "#198754";
        setTimeout(() => {
          btn.textContent = "Update";
          btn.style.background = "#C0392B";
        }, 1500);
        if (onUpdate) onUpdate();
      });
    });
  }

  render();
}

function orderCard(o) {
  return `
    <div style="background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden">

      <!-- Header -->
      <div style="display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem 1rem;
                  padding:1rem 1.25rem;border-bottom:1px solid #f0f0f0;background:#fafafa">
        <span style="font-family:monospace;font-size:0.8rem;color:#888;font-weight:700">
          #${String(o.id).slice(-6)}
        </span>
        <span style="font-weight:600;color:#1a1a1a">👤 ${o.user || "Guest"}</span>
        <span style="${statusBadge(o.status)}">${o.status}</span>
        <span style="margin-left:auto;color:#aaa;font-size:0.78rem;white-space:nowrap">
          ${o.date}
        </span>
      </div>

      <!-- Body -->
      <div style="padding:1rem 1.25rem">
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:0.5rem 1.5rem;margin-bottom:0.85rem;font-size:0.82rem">
          <div>
            <strong style="display:block;color:#1a1a1a;font-size:0.85rem">
              📍 Delivery Address
            </strong>
            ${o.address || "—"}
          </div>
          <div>
            <strong style="display:block;color:#1a1a1a;font-size:0.85rem">
              📞 Phone
            </strong>
            ${o.phone || "—"}
          </div>
          <div>
            <strong style="display:block;color:#1a1a1a;font-size:0.85rem">
              💳 Payment
            </strong>
            ${o.payment || "Cash on Delivery"}
          </div>
          ${
            o.updatedAt
              ? `<div>
            <strong style="display:block;color:#1a1a1a;font-size:0.85rem">
              🔄 Last Updated
            </strong>
            ${o.updatedAt}
          </div>`
              : ""
          }
        </div>

        <!-- Items list -->
        <div style="background:#f9f9f9;border-radius:8px;padding:0.75rem 1rem;
                    font-size:0.83rem;color:#444;margin-bottom:0.85rem">
          ${o.items
            .map(
              (i) => `
            <div style="display:flex;justify-content:space-between;padding:0.2rem 0">
              <span>${i.name} ×${i.qty}</span>
              <span>Le ${(i.price * i.qty).toLocaleString()}</span>
            </div>`,
            )
            .join("")}
          <div style="display:flex;justify-content:space-between;font-weight:700;
                      color:#1a1a1a;padding-top:0.5rem;margin-top:0.35rem;
                      border-top:1px solid #eee">
            <span>Total</span>
            <span>Le ${o.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Status update footer -->
      <div style="display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem;
                  padding:0.85rem 1.25rem;border-top:1px solid #f0f0f0">
        <span style="font-size:0.8rem;color:#888;font-weight:600">
          Change status:
        </span>
        <select class="status-sel" data-id="${o.id}"
                style="border:1px solid #ddd;border-radius:6px;padding:0.35rem 0.75rem;
                       font-size:0.82rem;background:#fff;cursor:pointer;outline:none">
          ${ORDER_STATUSES.map(
            (s) => `
            <option value="${s.value}"
                    ${o.status === s.value ? "selected" : ""}>
              ${s.label}
            </option>`,
          ).join("")}
        </select>
        <button class="update-btn" data-id="${o.id}"
                style="background:#C0392B;color:#fff;border:none;border-radius:6px;
                       padding:0.38rem 0.9rem;font-size:0.82rem;font-weight:600;
                       cursor:pointer">
          Update
        </button>
      </div>
    </div>`;
}

function statusBadge(status) {
  const map = {
    Received: "background:#f0f0f0;color:#555",
    Preparing: "background:rgba(253,126,20,0.12);color:#d46b08",
    Ready: "background:rgba(13,110,253,0.1);color:#0d6efd",
    "Out for Delivery": "background:rgba(111,66,193,0.1);color:#6f42c1",
    Delivered: "background:rgba(25,135,84,0.1);color:#198754",
    Cancelled: "background:rgba(220,53,69,0.1);color:#dc3545",
  };
  return `${map[status] || "background:#f0f0f0;color:#555"};
          padding:0.25rem 0.65rem;border-radius:20px;
          font-size:0.72rem;font-weight:600;display:inline-block`;
}
