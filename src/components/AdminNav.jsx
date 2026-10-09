import { NavLink } from "react-router-dom";
import styles from "./AdminNav.module.css";
import Logo from "./Logo";

import MenuBtn from "./MenuBtn";
import { useAuth } from "../Contexts/AuthContext";

function AdminNav({ isMenuOpen, setIsMenuOpen }) {
  const { logout } = useAuth();
  function handleToggleMenuButton() {
    setIsMenuOpen((isOpen) => !isOpen);
  }

  return (
    <nav className={styles.nav}>
      <Logo />

      <div className={styles.wrapperMenuAndUl}>
        <MenuBtn onclick={handleToggleMenuButton} />
        <ul
          className={`${styles.navList} ${isMenuOpen ? styles.openedUl : ""}`}
        >
          <li>
            <NavLink to="summary">Summary</NavLink>
          </li>
          <li>
            <NavLink to="incomes">Income</NavLink>
          </li>
          <li>
            <NavLink to="expenses">Expense</NavLink>
          </li>
          <li>
            <NavLink to="categories">Categories</NavLink>
          </li>
          <li>
            <NavLink to="products">Products</NavLink>
          </li>
          <li>
            <NavLink to="orders">Orders</NavLink>
          </li>
          <li>
            <NavLink to="users">Users</NavLink>
          </li>
          <li onClick={() => logout()}>
            <button className={styles.logoutBtn}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNav;
