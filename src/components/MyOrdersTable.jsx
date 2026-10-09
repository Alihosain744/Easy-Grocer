import Message from "./Message";
import styles from "./OrdersTable.module.css";
import ownStyles from "./MyOrdersTable.module.css";
import Spinner from "./Spinner";
function MyOrdersTable({ orders, isLoading }) {
  return (
    <div className={ownStyles.tableWrap}>
      {isLoading && <Spinner />}
      {orders?.length === 0 && !isLoading && (
        <Message className={ownStyles.msg} message="No orders found" />
      )}
      {orders?.length > 0 && (
        <table className={`${styles.ordersTable} ${ownStyles.myOrdersTable}`}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Item</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remain</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.cartItems.map((item) => (
                    <li key={item.id} className={ownStyles.itemList}>
                      {item.name} {item.price} AFs X {item.quantity}
                    </li>
                  ))}
                </td>
                <td>{order.total} AFs</td>
                <td>{order.paidAmount} AFs</td>
                <td>{order.remain} AFs</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyOrdersTable;
