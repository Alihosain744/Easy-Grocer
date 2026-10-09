import { useEffect, useState } from "react";
import styles from "./CustomerDashboard.module.css";
import Filter from "./Filter";
import Search from "./Search";
import CartSum from "./CartSum";
import OrdersTable from "./OrdersTable";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import Products from "./Products";
import { useAuth } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import { useOrders } from "../Contexts/OrdersContext";
import { useNavigate } from "react-router-dom";

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

function CustomerDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const { orders, loadMyOrders } = useOrders();

  const { cart } = useCart();
  const numCartItems = cart?.length;

  const delivery_fee = 2;
  const subtotal = cart
    ?.map((cartItem) => cartItem?.quantity * Number(cartItem?.product?.price))
    .reduce((sum, cur) => sum + cur, 0);
  const total = subtotal + delivery_fee;

  const [showCategory, setShowCategory] = useState(false);

  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showOrder, setShowOrder] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(
    function () {
      loadMyOrders(currentUser?.id);
    },
    [currentUser]
  );

  function handleViewOrder(order) {
    setSelectedOrder(order);
    setOpen(true);
  }

  function handleShowCategory() {
    setShowCategory((show) => !show);
  }

  function handleShowCart() {
    setShowCart((show) => !show);
  }
  function handleShowOrder() {
    setShowOrder((show) => !show);
  }

  function handleLogout(e) {
    e.preventDefault();
    logout();
    navigate("/");
  }
  return (
    <main className={styles.container}>
      <section className={styles.head}>
        <button className={styles.control} onClick={handleShowCategory}>
          {showCategory ? "Close" : "Categories"}
        </button>

        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search for products here"
          marginTop={10}
          className={styles.customer_search}
        />

        <button
          onClick={handleShowCart}
          className={`${styles.control} ${styles.btnCart} `}
        >
          {showCart ? "Close" : "Cart"}
          <span className={styles.numCartItems}>{numCartItems ?? 0}</span>
        </button>

        <button onClick={handleShowOrder} className={styles.control}>
          {" "}
          {showOrder ? "Close" : "Orders"}
        </button>
        <button onClick={handleLogout} className={styles.control}>
          Logout
        </button>
      </section>

      <section className={styles.dropdown_content}>
        <Filter
          showCategory={showCategory}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          className={styles.customer_filter}
        />
        {showCart && (
          <CartSum
            total={total}
            subtotal={subtotal}
            deliveryFee={delivery_fee}
            className={styles.customer_cart}
          />
        )}
        {showOrder && (
          <div className={styles.ordersContainer}>
            {/* Here only show the orders for one specific customer who
            has already been logged in to system */}
            <OrdersTable
              orders={orders}
              handleViewOrder={handleViewOrder}
              usedForCustomer={true}
            />
            <OrderDetailsDrawer
              // favStyle={{ marginTop: "0", maxWidth: "99%" }}
              className={styles.customer_drawer}
              order={selectedOrder}
              open={open}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </section>

      <section className={`${showCart && styles.comeDown}  ${styles.content}`}>
        <Products
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </section>
      <footer className={styles.footer}></footer>
    </main>
  );
}

export default CustomerDashboard;
