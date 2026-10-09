import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import MenuBtn from "./MenuBtn";
import { useAuth } from "../Contexts/AuthContext";

function PageNav({ isMenuOpen, setIsMenuOpen, numCartItems = 0, classname }) {
  const { currentUser } = useAuth();

  function handleToggleMenuButton() {
    setIsMenuOpen((isOpen) => !isOpen);
  }

  return (
    <nav className={`${styles.nav} ${classname || ""}`}>
      <Logo />
      <div className={`${isMenuOpen ? styles.turnNavVertical : ""}`}>
        <MenuBtn onclick={handleToggleMenuButton} />

        <ul className={`${isMenuOpen ? styles.openedNav : ``}`}>
          {currentUser?.role !== "admin" && (
            <li>
              <NavLink className={styles.cartLink} to="/cart">
                cart
              </NavLink>
              <span className={styles.numCartItems}>{numCartItems ?? 0}</span>
            </li>
          )}

          <li>
            <NavLink to="/signin">sign in</NavLink>
          </li>

          <li>
            <NavLink to="/signup">sign up</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default PageNav;
