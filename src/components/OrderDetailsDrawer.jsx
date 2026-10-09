import styles from "./OrderDetailsDrawer.module.css";

function OrderDetailsDrawer({ open, order, onClose, className = "" }) {
  if (!open || !order) return null;

  return (
    <div className={`${styles.drawer} ${className}`}>
      <h2>Order #{order.id}</h2>

      <section className={styles.drawerSection}>
        <h3>Customer</h3>
        <p>Name: {order.customer}</p>
        <p>User ID: {order.userId}</p>
        <p>Address: {order.address}</p>
        <p>Phone Number: {order.phone ? order.phone : "N/A"}</p>
      </section>

      <section className={styles.drawerSection}>
        <h3>Items</h3>
        {order.cartItems.map((item) => (
          <div key={item.id}>
            {item.name} x {item.quantity} {item.price}
          </div>
        ))}
      </section>

      <section className={styles.drawerSection}>
        <h3>Payment</h3>
        <p>Total: {order.total} AFs</p>
        <p>Paid Amount: {order.paidAmount} AFs</p>
        <p>Remaining: {order.remain} AFs</p>
        <p>Method: {order.paymentMethod}</p>
      </section>

      <button className={styles.drawerCloseBtn} onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default OrderDetailsDrawer;
