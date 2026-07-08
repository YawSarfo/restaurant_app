import { getCart, clearCart } from "../utils/cart.js";
import { getUser } from "../utils/auth.js";

export function renderCheckout(container) {
  const user = getUser();
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (!user) {
    window.location.hash = "#login";
    return;
  }
  if (cart.length === 0) {
    window.location.hash = "#home";
    return;
  }

  container.innerHTML = `
    <div class="container py-5" style="max-width:550px">
      <h2 class="fw-bold mb-4">Checkout</h2>

      <div class="mb-3">
        <label class="form-label">Delivery Address</label>
        <input id="address" class="form-control"
               placeholder="e.g. 14 Wilkinson Road, Freetown" />
      </div>
      <div class="mb-3">
        <label class="form-label">Phone Number</label>
        <input id="phone" class="form-control"
               placeholder="+232 76 000 000" />
      </div>
      <div class="mb-3">
        <label class="form-label">Payment Method</label>
        <select id="payment" class="form-select">
          <option>Cash on Delivery</option>
          <option>Orange Money</option>
          <option>Africell Money</option>
        </select>
      </div>

      <div class="border rounded p-3 mb-4 bg-light">
        <strong>Order Summary</strong>
        ${cart
          .map(
            (i) => `
          <div class="d-flex justify-content-between mt-2">
            <span>${i.name} ×${i.qty}</span>
            <span>Le ${(i.price * i.qty).toLocaleString()}</span>
          </div>`,
          )
          .join("")}
        <hr/>
        <div class="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span class="text-danger">Le ${total.toLocaleString()}</span>
        </div>
      </div>

      <button id="place-order" class="btn btn-brand w-100 btn-lg">
        Place Order
      </button>
    </div>`;

  document.getElementById("place-order").addEventListener("click", () => {
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!address || !phone) {
      alert("Please fill in your delivery details.");
      return;
    }

    const order = {
      id: Date.now(),
      user: user.email,
      items: cart,
      total,
      address,
      phone,
      payment: document.getElementById("payment").value,
      status: "Received",
      date: new Date().toLocaleString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    clearCart();

    container.innerHTML = `
      <div class="container py-5 text-center">
        <div style="font-size:4rem">🎉</div>
        <h2 class="fw-bold mt-3">Order Placed!</h2>
        <p class="text-muted">
          Order #${String(order.id).slice(-6)} received.<br/>
          We'll deliver to <strong>${address}</strong>.
        </p>
        <a href="#home" class="btn btn-brand mt-3">Back to Menu</a>
      </div>`;
  });
}
