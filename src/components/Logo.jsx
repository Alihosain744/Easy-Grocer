import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to="/">
      <span className={styles.logo}>
        <img src="/logo.png" className={styles.logo} />
      </span>
    </Link>
  );
}

export default Logo;
