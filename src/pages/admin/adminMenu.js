import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  CATEGORIES,
} from "../../utils/menu.js";

export function renderAdminMenu(container) {
  let editingId = null;
  let showForm = false;

  function render() {
    const items = getMenuItems();
    const grouped = CATEGORIES.map((cat) => ({
      cat,
      items: items.filter((i) => i.category === cat),
    })).filter((g) => g.items.length > 0);

    container.innerHTML = `
      <div style="display:flex;align-items:flex-start;
                  justify-content:space-between;gap:1rem;
                  margin-bottom:1.5rem;flex-wrap:wrap">
        <div>
          <h2 style="font-size:1.6rem;font-weight:700;color:#1a1a1a;margin:0 0 0.25rem">
            Menu Items
          </h2>
          <p style="color:#888;font-size:0.85rem;margin:0">
            ${items.length} items ·
            ${items.filter((i) => i.available).length} active
          </p>
        </div>
        <button id="toggle-form-btn"
                style="background:#C0392B;color:#fff;border:none;border-radius:8px;
                       padding:0.6rem 1.25rem;font-size:0.9rem;font-weight:600;
                       cursor:pointer;white-space:nowrap">
          + Add Item
        </button>
      </div>

      <!-- Add / Edit Form -->
      <div id="item-form"
           style="background:#fff;border:1px solid #eee;border-radius:12px;
                  padding:1.5rem;margin-bottom:1.5rem;
                  display:${showForm ? "block" : "none"}">
        <h3 style="font-size:1rem;font-weight:700;margin:0 0 1.25rem;color:#1a1a1a"
            id="form-heading">
          ${editingId ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:0.85rem 1.25rem;margin-bottom:0.85rem">
          ${formField("f-name", "text", "Item Name *", "e.g. Grilled Tilapia")}
          ${formField("f-price", "number", "Price (Le) *", "25000")}
          ${formField("f-emoji", "text", "Emoji Icon", "🍽️")}
          ${formField("f-image", "text", "Image URL", "https://yourserver.com/images/dish.jpg")}
          <div style="display:flex;flex-direction:column;gap:0.35rem">
            <label style="${labelStyle}">Category *</label>
            <select id="f-category" style="${inputStyle}">
              ${CATEGORIES.map((c) => `<option>${c}</option>`).join("")}
            </select>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.35rem;
                      grid-column:1/-1">
            <label style="${labelStyle}">Description</label>
            <textarea id="f-description" rows="2"
                      style="${inputStyle}resize:vertical;min-height:60px;
                              font-family:inherit"
                      placeholder="Short description of the dish…"></textarea>
          </div>
        </div>

        <div id="form-error"
             style="display:none;background:rgba(220,53,69,0.1);
                    border:1px solid rgba(220,53,69,0.3);color:#dc3545;
                    border-radius:6px;padding:0.5rem 0.85rem;
                    font-size:0.83rem;margin-bottom:0.75rem">
          Please fill in all required fields.
        </div>

        <div style="display:flex;gap:0.75rem;justify-content:flex-end">
          <button id="cancel-form"
                  style="background:none;border:1px solid #ddd;color:#666;
                         border-radius:7px;padding:0.55rem 1.1rem;
                         font-size:0.88rem;cursor:pointer">
            Cancel
          </button>
          <button id="save-item"
                  style="background:#C0392B;color:#fff;border:none;
                         border-radius:7px;padding:0.55rem 1.4rem;
                         font-size:0.88rem;font-weight:600;cursor:pointer">
            Save Item
          </button>
        </div>
      </div>

      <!-- Items by category -->
      ${
        grouped.length === 0
          ? `<div style="background:#fff;border:1px solid #eee;border-radius:12px;
                       padding:3rem;text-align:center;color:#aaa">
             <div style="font-size:2.5rem">🍴</div>
             <p style="margin:0.75rem 0 0">No menu items yet.</p>
           </div>`
          : grouped
              .map(
                ({ cat, items: catItems }) => `
            <div style="margin-bottom:2rem">
              <div style="display:flex;align-items:center;gap:0.75rem;
                          margin-bottom:0.85rem;padding-bottom:0.5rem;
                          border-bottom:2px solid #f0f0f0">
                <span style="font-size:1rem;font-weight:700;color:#1a1a1a">
                  ${cat}
                </span>
                <span style="font-size:0.75rem;color:#aaa;font-weight:600">
                  ${catItems.length} item${catItems.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div style="display:grid;
                          grid-template-columns:repeat(auto-fill,minmax(290px,1fr));
                          gap:0.85rem">
                ${catItems.map((item) => menuItemCard(item)).join("")}
              </div>
            </div>`,
              )
              .join("")
      }`;

    // Show/hide form
    document.getElementById("toggle-form-btn").addEventListener("click", () => {
      showForm = true;
      editingId = null;
      render();
      fillForm(null);
    });

    document.getElementById("cancel-form")?.addEventListener("click", () => {
      showForm = false;
      editingId = null;
      render();
    });

    // Save item
    document.getElementById("save-item")?.addEventListener("click", () => {
      const name = document.getElementById("f-name").value.trim();
      const price = parseInt(document.getElementById("f-price").value);
      const category = document.getElementById("f-category").value;
      const emoji = document.getElementById("f-emoji").value.trim() || "🍽️";
      const image = document.getElementById('f-image').value.trim() || '';
      const description = document.getElementById("f-description").value.trim();
      const errorEl = document.getElementById("form-error");

      if (!name || !price || price <= 0) {
        errorEl.style.display = "block";
        return;
      }
      errorEl.style.display = "none";

      if (editingId) {
        updateMenuItem(editingId, {
          name,
          price,
          category,
          emoji,
          description,
          image
        });
      } else {
        addMenuItem({ name, price, category, emoji, description, image });
      }

      showForm = false;
      editingId = null;
      render();
    });

    // Availability toggles
    container.querySelectorAll(".avail-cb").forEach((cb) => {
      cb.addEventListener("change", () => {
        updateMenuItem(parseInt(cb.dataset.id), { available: cb.checked });
      });
    });

    // Edit buttons
    container.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const item = getMenuItems().find((i) => i.id === id);
        editingId = id;
        showForm = true;
        render();
        fillForm(item);
      });
    });

    // Delete buttons
    container.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const item = getMenuItems().find((i) => i.id === id);
        if (confirm(`Delete "${item?.name}"? This cannot be undone.`)) {
          deleteMenuItem(id);
          render();
        }
      });
    });
  }

  function fillForm(item) {
    if (!item) return;
    document.getElementById("f-name").value = item.name;
    document.getElementById("f-price").value = item.price;
    document.getElementById("f-category").value = item.category;
    document.getElementById("f-emoji").value = item.emoji || "";
    document.getElementById("f-description").value = item.description || "";
    document.getElementById("f-image").value = item.image || "";
  }

  render();
}

const labelStyle = `
  font-size:0.78rem;font-weight:600;color:#666;
  text-transform:uppercase;letter-spacing:0.4px`;

const inputStyle = `
  border:1px solid #ddd;border-radius:7px;padding:0.55rem 0.85rem;
  font-size:0.88rem;outline:none;background:#fafafa;width:100%;
  box-sizing:border-box;`;

function formField(id, type, label, placeholder) {
  return `
    <div style="display:flex;flex-direction:column;gap:0.35rem">
      <label for="${id}" style="${labelStyle}">${label}</label>
      <input id="${id}" type="${type}"
             style="${inputStyle}"
             placeholder="${placeholder}" />
    </div>`;
}

function menuItemCard(item) {
  return `
    <div style="background:#fff;border:1px solid #eee;border-radius:10px;
                padding:1rem 1.15rem;display:flex;flex-direction:column;gap:0.5rem;
                opacity:${item.available ? 1 : 0.55}">
      <div style="display:flex;align-items:flex-start;gap:0.75rem">
      <div style="width:56px;height:56px;border-radius:8px;overflow:hidden;
                  flex-shrink:0;background:#f0f0f0">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}"
                  style="width:100%;height:100%;object-fit:cover" />`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;
                        justify-content:center;color:#ccc;font-size:1.5rem">🍽️</div>`}
      </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:0.9rem;font-weight:700;color:#1a1a1a">
            ${item.name}
          </div>
          <div style="font-size:0.77rem;color:#888;margin-top:0.15rem;
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ${item.description || "—"}
          </div>
          <div style="font-size:0.95rem;font-weight:700;color:#C0392B;margin-top:0.2rem">
            Le ${item.price.toLocaleString()}
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.35rem">
        <label style="flex:1;display:flex;align-items:center;gap:0.4rem;
                      font-size:0.75rem;font-weight:600;color:#888;cursor:pointer">
          <input type="checkbox" class="avail-cb" data-id="${item.id}"
                 ${item.available ? "checked" : ""}
                 style="accent-color:#198754" />
          ${item.available ? "Available" : "Unavailable"}
        </label>
        <button class="edit-btn" data-id="${item.id}"
                style="background:#f0f4ff;color:#0d6efd;border:none;
                       border-radius:6px;padding:0.3rem 0.65rem;
                       font-size:0.77rem;font-weight:600;cursor:pointer">
          ✏️ Edit
        </button>
        <button class="delete-btn" data-id="${item.id}"
                style="background:#fff0f0;color:#C0392B;border:none;
                       border-radius:6px;padding:0.3rem 0.65rem;
                       font-size:0.77rem;cursor:pointer">
          🗑️
        </button>
      </div>
    </div>`;
}
