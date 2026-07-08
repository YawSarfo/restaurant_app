import { getOrderStats, getAllOrders } from "../../utils/orders.js";
import { getMenuItems } from "../../utils/menu.js";

export function renderAdminOverview(container) {
  const stats = getOrderStats();
  const recent = getAllOrders().slice(0, 5);
  const menuItems = getMenuItems();

  container.innerHTML = `
    <h2 style="font-size:1.6rem;font-weight:700;color:#1a1a1a;margin:0 0 0.25rem">
      Overview
    </h2>
    <p style="color:#888;font-size:0.85rem;margin:0 0 1.75rem">
      ${new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>

    <!-- KPI cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
                gap:1rem;margin-bottom:1.75rem">
      ${kpiCard("📋", "#C0392B", stats.todayCount, "Orders Today")}
      ${kpiCard("💰", "#198754", "Le " + stats.todayRevenue.toLocaleString(), "Today's Revenue")}
      ${kpiCard("⏳", "#fd7e14", stats.pending, "Pending Orders")}
      ${kpiCard(
        "🍴",
        "#0d6efd",
        menuItems.filter((i) => i.available).length + " / " + menuItems.length,
        "Menu Items Active",
      )}
      ${kpiCard("📦", "#6f42c1", stats.total, "Total Orders")}
      ${kpiCard("💵", "#20c997", "Le " + stats.totalRevenue.toLocaleString(), "Total Revenue")}
    </div>

    <!-- Recent orders table -->
    <div style="background:#fff;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;
                  padding:1.25rem 1.5rem;border-bottom:1px solid #f0f0f0">
        <h3 style="margin:0;font-size:1rem;font-weight:700;color:#1a1a1a">
          Recent Orders
        </h3>
      </div>
      ${
        recent.length === 0
          ? `<p style="padding:3rem;text-align:center;color:#aaa">No orders yet.</p>`
          : `<div style="overflow-x:auto">
             <table style="width:100%;border-collapse:collapse;font-size:0.875rem">
               <thead>
                 <tr>
                   ${[
                     "Order ID",
                     "Customer",
                     "Items",
                     "Total",
                     "Status",
                     "Date",
                   ]
                     .map(
                       (h) => `<th style="background:#fafafa;color:#888;
                                           font-size:0.75rem;font-weight:600;
                                           text-transform:uppercase;letter-spacing:0.5px;
                                           padding:0.75rem 1rem;text-align:left;
                                           border-bottom:1px solid #eee">${h}</th>`,
                     )
                     .join("")}
                 </tr>
               </thead>
               <tbody>
                 ${recent
                   .map(
                     (o) => `
                   <tr>
                     <td style="padding:0.85rem 1rem;border-bottom:1px solid #f5f5f5;
                                font-family:monospace;color:#888;font-size:0.8rem">
                       #${String(o.id).slice(-6)}
                     </td>
                     <td style="padding:0.85rem 1rem;border-bottom:1px solid #f5f5f5">
                       ${o.user || "Guest"}
                     </td>
                     <td style="padding:0.85rem 1rem;border-bottom:1px solid #f5f5f5">
                       ${o.items.length} item${o.items.length !== 1 ? "s" : ""}
                     </td>
                     <td style="padding:0.85rem 1rem;border-bottom:1px solid #f5f5f5;
                                font-weight:600">
                       Le ${o.total.toLocaleString()}
                     </td>
                     <td style="padding:0.85rem 1rem;border-bottom:1px solid #f5f5f5">
                       <span style="${statusStyle(o.status)}">${o.status}</span>
                     </td>
                     <td style="padding:0.85rem 1rem;border-bottom:1px solid #f5f5f5;
                                color:#aaa;font-size:0.78rem;white-space:nowrap">
                       ${o.date}
                     </td>
                   </tr>`,
                   )
                   .join("")}
               </tbody>
             </table>
           </div>`
      }
    </div>`;
}

function kpiCard(icon, color, value, label) {
  return `
    <div style="background:#fff;border-radius:12px;padding:1.25rem 1.5rem;
                border:1px solid #eee">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;
                  align-items:center;justify-content:center;font-size:1.2rem;
                  background:${color}18;margin-bottom:0.5rem">${icon}</div>
      <div style="font-size:1.5rem;font-weight:700;color:#1a1a1a">${value}</div>
      <div style="font-size:0.78rem;color:#888;font-weight:500">${label}</div>
    </div>`;
}

function statusStyle(status) {
  const map = {
    Received: "background:#f0f0f0;color:#555",
    Preparing: "background:rgba(253,126,20,0.12);color:#d46b08",
    Ready: "background:rgba(13,110,253,0.1);color:#0d6efd",
    "Out for Delivery": "background:rgba(111,66,193,0.1);color:#6f42c1",
    Delivered: "background:rgba(25,135,84,0.1);color:#198754",
    Cancelled: "background:rgba(220,53,69,0.1);color:#dc3545",
  };
  const style = map[status] || "background:#f0f0f0;color:#555";
  return `${style};padding:0.25rem 0.65rem;border-radius:20px;
          font-size:0.72rem;font-weight:600;display:inline-block`;
}
