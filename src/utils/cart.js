const KEY = "cart";

export const getCart = () => JSON.parse(localStorage.getItem(KEY) || "[]");

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });
  localStorage.setItem(KEY, JSON.stringify(cart));
}

export function removeFromCart(id) {
  const updated = getCart().filter((i) => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export const clearCart = () => localStorage.removeItem(KEY);
