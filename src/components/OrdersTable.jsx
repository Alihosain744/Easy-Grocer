import { useEffect, useState } from "react";
import { useOrders } from "../Contexts/OrdersContext";
import styles from "./OrdersTable.module.css";
import Modal from "./Modal";
import { useNavigate, Link } from "react-router-dom";
import Message from "./Message";
import Spinner from "./Spinner";
import { useIncome } from "../Contexts/FinanceContext";

function OrdersTable({
  handleViewOrder,
  className = "",
  usedForCustomer = false,
}) {
  const {
    orders,
    deleteOrder,
    searchQuery,
    filterOption,
    filter,
    isLoading,
    editOrder,
  } = useOrders();

  const { incomes } = useIncome();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;

    if (
      filter === "" ||
      filter === "all_customers" ||
      filter === "all_status"
    ) {
      // in this case do not do filtering so matchesFilter = true;
      matchesFilter = true;
    } else if (filterOption === "customer") {
      matchesFilter = order.customer === filter;
    } else if (filterOption === "status") {
      matchesFilter = order.status === filter;
    }

    return matchesSearch && matchesFilter;
  });

  const total_remain = filteredOrders.reduce(
    (total, order) => total + order.remain,
    0
  );

  const navigate = useNavigate();

  const [IsModalOpen, setIsModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [favDeleteMsg, setFavDeleteMsg] = useState("");

  function handle_delete_order(order) {
    const related_incomes = incomes.filter(
      (inc) => inc.orderId === order.id
    ).length;
    if (related_incomes > 0) {
      setFavDeleteMsg(`This order is used by ${related_incomes} incomes`);

      setIsModalOpen(false);
      return;
    }
    setIsModalOpen(true);
    setSelectedOrder(order);
  }

  function handleConfirm() {
    deleteOrder(selectedOrder.id);
    setIsModalOpen(false);
  }

  function handle_edit_order(order) {
    navigate(`../addOrder`, { state: { order, mode: "edit" } });
  }

  async function handleCancelOrder(e, order) {
    e.preventDefault();
    await editOrder({ ...order, status: "cancelled" });
  }

  useEffect(
    function () {
      if (!favDeleteMsg) return;
      const timer = setTimeout(function () {
        setFavDeleteMsg("");
      }, 2000);

      return () => clearTimeout(timer);
    },
    [favDeleteMsg]
  );

  return (
    <div className={`${styles.tableWrapper}`}>
      {favDeleteMsg && (
        <Message className={styles.msg} message={favDeleteMsg} />
      )}
      {isLoading ? (
        <Spinner />
      ) : filteredOrders.length <= 0 ? (
        <Message className={styles.msg} message="No orders exist!" />
      ) : (
        <table className={`${styles.ordersTable} `}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th className={styles.hidden}>Items</th>
              <th className={styles.hidden}>Total</th>
              <th className={styles.hidden}>Paid Amount</th>
              <th className={styles.hidden}>Remain</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order, i) => (
              <tr key={i}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td className={styles.hidden}>{order.cartItems.length}</td>
                <td className={styles.hidden}>{order.total} AFs</td>
                <td className={styles.hidden}>{order.paidAmount} AFs</td>
                <td className={styles.hidden}>{order.remain} AFs</td>
                <td>
                  {order.status === "pending" && (
                    <span className={styles.pending}>Pending</span>
                  )}
                  {order.status === "confirmed" && (
                    <span className={styles.confirmed}>Confirmed</span>
                  )}
                  {order.status === "delivered" && (
                    <span className={styles.delivered}>Delivered</span>
                  )}
                  {order.status === "cancelled" && (
                    <span className={styles.cancelled}>Cancelled</span>
                  )}
                </td>

                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleViewOrder(order)}
                    className={styles.action}
                  >
                    View
                  </button>
                  {usedForCustomer &&
                    (order.status === "pending" ||
                      order.status === "confirmed") && (
                      <button
                        onClick={(e) => handleCancelOrder(e, order)}
                        className={styles.action}
                      >
                        Cancel order
                      </button>
                    )}
                  {!usedForCustomer && (
                    <button
                      onClick={() => handle_edit_order(order)}
                      className={styles.action}
                    >
                      Edit
                    </button>
                  )}
                  {!usedForCustomer && (
                    <button
                      onClick={() => handle_delete_order(order)}
                      className={styles.action}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {orders.length >= 1 && (
        <div className={styles.total_remain}>
          <span>Total Pending (Loan):</span>
          <span>{total_remain} AF</span>
        </div>
      )}
      <Modal
        mode="delete"
        IsModalOpen={IsModalOpen}
        setIsModalOpen={setIsModalOpen}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default OrdersTable;
