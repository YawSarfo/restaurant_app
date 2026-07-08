import { getCart, removeFromCart } from "../utils/cart.js";
import { getUser } from "../utils/auth.js";

export function renderCart(container) {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  container.innerHTML = `
    <div class="container py-5" style="max-width:700px">
      <h2 class="fw-bold mb-4">Your Cart</h2>

      ${
        cart.length === 0
          ? `<p class="text-muted">
             Your cart is empty.
             <a href="#home">Browse the menu</a>.
           </p>`
          : `<table class="table align-middle">
             <thead>
               <tr>
                 <th>Item</th><th>Qty</th><th>Price</th><th></th>
               </tr>
             </thead>
             <tbody id="cart-body"></tbody>
           </table>
           <div class="text-end fw-bold fs-5 mb-3">
             Total: Le ${total.toLocaleString()}
           </div>
           <a href="${getUser() ? "#checkout" : "#login"}"
              class="btn btn-brand w-100">
             ${getUser() ? "Proceed to Checkout" : "Login to Checkout"}
           </a>`
      }
    </div>`;

  if (cart.length > 0) {
    const tbody = document.getElementById("cart-body");
    cart.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
  <td>
    <div style="display:flex;align-items:center;gap:0.75rem">
      <img src="${item.image}" alt="${item.name}"
           style="width:52px;height:52px;object-fit:cover;
                  border-radius:8px;flex-shrink:0" />
      <span class="fw-semibold">${item.name}</span>
    </div>
  </td>
  <td>${item.qty}</td>
  <td>Le ${(item.price * item.qty).toLocaleString()}</td>
  <td>
    <button class="btn btn-sm btn-outline-danger remove-btn"
            data-id="${item.id}">✕</button>
  </td>`;
      tbody.appendChild(tr);
    });

    tbody.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        removeFromCart(parseInt(e.target.dataset.id));
        renderCart(container);
      }
    });
  }
}
