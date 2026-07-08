const ORDERS_KEY = "orders";

export const ORDER_STATUSES = [
  { value: "Received", label: "Received" },
  { value: "Preparing", label: "Preparing" },
  { value: "Ready", label: "Ready for Pickup" },
  { value: "Out for Delivery", label: "Out for Delivery" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

export function getAllOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]").reverse();
}

export function updateOrderStatus(orderId, status) {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  const index = orders.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    orders[index].updatedAt = new Date().toLocaleString();
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

export function getOrderStats() {
  const orders = getAllOrders();
  const today = new Date().toDateString();
  return {
    total: orders.length,
    todayCount: orders.filter((o) => new Date(o.id).toDateString() === today)
      .length,
    todayRevenue: orders
      .filter(
        (o) =>
          new Date(o.id).toDateString() === today && o.status !== "Cancelled",
      )
      .reduce((sum, o) => sum + o.total, 0),
    totalRevenue: orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter((o) =>
      ["Received", "Preparing", "Ready", "Out for Delivery"].includes(o.status),
    ).length,
  };
}
