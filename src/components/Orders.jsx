import { useEffect, useState } from "react";
import styles from "./Orders.module.css";
import OrdersTable from "./OrdersTable";
import Search from "./Search";

import OrderDetailsDrawer from "./OrderDetailsDrawer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useOrders } from "../Contexts/OrdersContext";
import Message from "./Message";

// const orders = [
//   {
//     id: 101,
//     userId: 1,
//     customer: "ali",
//     cartItems: [
//       { name: "energy", quantity: 1, price: 50 },
//       { name: "chocolate", quantity: 1, price: 100 },
//       { name: "beverage", quantity: 2, price: 100 },
//     ],
//     total: 250,
//     paidAmount: 250,
//     paymentMethod: "Pay now",
//     status: "pending",
//     paid: true,
//     remain: 0,
//     address: "kabul-afghanistan",
//     createdAt: "2026/05/27",
//   },
//   {
//     id: 102,
//     userId: 2,
//     customer: "ahmad",
//     cartItems: [
//       { name: "noodles", quantity: 1, price: 50 },
//       { name: "ciggarettes", quantity: 1, price: 100 },
//       { name: "pouches", quantity: 1, price: 500 },
//     ],
//     total: 200,
//     paidAmount: 100,
//     paymentMethod: "pay later",
//     status: "delivered",
//     paid: false,
//     remain: 100,
//     address: "kabul-afghanistan",
//     createdAt: "2026/05/26",
//   },
//   {
//     id: 103,
//     userId: 3,
//     customer: "layla",
//     cartItems: [
//       { name: "spaghatti", quantity: 1, price: 50 },
//       { name: "yoghurt", quantity: 2, price: 25 },
//       { name: "salt", quantity: 1, price: 50 },
//     ],
//     total: 150,
//     paidAmount: 150,
//     paymentMethod: "pay now",
//     status: "delivered",
//     paid: true,
//     remain: 0,
//     address: "kabul-afghanistan",
//     createdAt: "2026/05/25",
//   },

//   {
//     id: 104,
//     userId: 4,
//     customer: "Maryam",
//     cartItems: [
//       { name: "Corn", quantity: 2, price: 50 },
//       { name: "Energy", quantity: 5, price: 30 },
//       { name: "sugar", quantity: 1, price: 100 },
//       { name: "tea", quantity: 1, price: 70 },
//       { name: "coffee", quantity: 1, price: 150 },
//     ],
//     total: 500,
//     paidAmount: 0,
//     paymentMethod: "COD",
//     status: "confirmed",
//     paid: false,
//     remain: 500,
//     address: "kabul-afghanistan",
//     createdAt: "2026/05/26",
//   },
// ];

function Orders() {
  const {
    orders,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterOption,
    setFilterOption,
    filter,
    setFilter,
  } = useOrders();

  const location = useLocation();
  const navigate = useNavigate();

  const [showMessage, setShowMessage] = useState(
    location.state?.showMsg ?? false
  );

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  const customers = orders.map((o) => o.customer);

  const unique_Customers = [...new Set(customers)];

  useEffect(
    function () {
      if (!showMessage) return;

      const timer = setTimeout(function () {
        setShowMessage(false);
        navigate(location.pathname, { replace: true, state: null });
      }, 3000);

      return () => clearTimeout(timer);
    },
    [showMessage, navigate, location.pathname]
  );

  function handleViewOrder(order) {
    setSelectedOrder(order);
    setOpen(true);
  }

  return (
    <main className={styles.ordersContainer}>
      <div className={styles.top}>
        <h2>Filter Orders By:</h2>
        <select
          className={styles.filter}
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="status">Status</option>
        </select>

        <select
          className={styles.filter}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filterOption === "customer" && (
            <>
              <option value="all_customers">All Customers</option>
              {unique_Customers.map((customer, i) => (
                <option key={i} value={customer}>
                  {customer}
                </option>
              ))}
            </>
          )}

          {filterOption === "status" && (
            <>
              <option value="all_status">All status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
            </>
          )}
        </select>

        <div className={styles.searchContainer}>
          <Search
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search for orders based on id or customer..."
            marginTop={10}
          />
        </div>
      </div>

      <section className={styles.msg}>
        {showMessage && <Message message={location.state?.msg} />}
      </section>
      <section className={styles.table_drawer_wrapper}>
        <section className={styles.ordersTable}>
          <OrdersTable handleViewOrder={handleViewOrder} />
          <Link className={styles.addOrderBtn} to="../addOrder">
            Add Order
          </Link>
        </section>

        <OrderDetailsDrawer
          className={styles.adminMargin}
          order={selectedOrder}
          open={open}
          onClose={() => setOpen(false)}
        />
      </section>
    </main>
  );
}

export default Orders;
