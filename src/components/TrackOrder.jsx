import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useOrders } from "../Contexts/OrdersContext";
import styles from "./TrackOrder.module.css";
import MyOrdersTable from "./MyOrdersTable";
import { Link } from "react-router-dom";

function TrackOrder() {
  const { currentUser } = useAuth();

  const { orders, isLoading, loadMyOrders, loadGuestOrders } = useOrders();

  const [phone, setPhone] = useState("");

  const [submittedPhone, setSubmittedPhone] = useState(null);
  const [error, setError] = useState({});

  useEffect(
    function () {
      if (currentUser) {
        loadMyOrders(currentUser.id);
      } else {
        loadGuestOrders(submittedPhone);
      }
    },
    [currentUser, submittedPhone]
  );

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    const phoneRegExp = /^07[0-9]{8}$/;
    if (!phone.trim()) {
      newErrors.phone = "Please enter a phone number!";
    } else if (!phoneRegExp.test(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number as of 07xxxxxxxx";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});
    setSubmittedPhone(phone.trim());
  }

  return (
    <div className={styles.container}>
      <Link className={styles.honeLink} to="/">
        Home
      </Link>

      {!currentUser && (
        <form className={styles.phoneForm} onSubmit={handleSubmit}>
          <div className={styles.col}>
            <label>Enter the phone number you used at checkout</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className={styles.error}>{error.phone}</p>
          </div>
          <div className={styles.col}>
            <button className={styles.phoneSubmit} type="submit">
              Track order
            </button>
          </div>
        </form>
      )}
      <h1>
        {currentUser &&
          currentUser?.role !== "admin" &&
          orders?.length > 0 &&
          `Order for the user ${currentUser.name}`}
        {!currentUser &&
          orders?.length > 0 &&
          `Order for the user Guest with phone number of ${orders[0]?.phone} `}
      </h1>
      <MyOrdersTable isLoading={isLoading} orders={orders} />
    </div>
  );
}

export default TrackOrder;
