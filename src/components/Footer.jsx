import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import Logo from "./Logo";
import { useAuth } from "../Contexts/AuthContext";

function Footer() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  return (
    <footer className={styles.footer}>
      <div className={styles.customerSupport}>
        <Logo className={styles.logo} />
        <p>30 years in service</p>
        <p>Freshness guaranteed</p>
        <p>Refund Support</p>
        {!isAdmin && <Link to="trackOrder">Track Order</Link>}
      </div>
      <div className={styles.contactUs}>
        <h3>Contact Us</h3>
        <span>
          <label>Phone: </label>
          <span>0778951223</span>
        </span>

        <span>
          <label>Email: </label>
          <span>aliMart@yahoo.com</span>
        </span>
      </div>

      <div className={styles.paymentMethods}>
        <h3>Payment Methods</h3>
        <h5>COD (Cash on delivery)</h5>
        <h5>Pay now</h5>
        <h5>Pay Later</h5>
      </div>
      <p className={styles.copyright}>
        &copy; Copyright {new Date().getFullYear()} by Ali Hosain Amini Inc.
      </p>
    </footer>
  );
}

export default Footer;
