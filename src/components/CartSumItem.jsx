import { useAuth } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import styles from "./CartSumItem.module.css";

function CartSumItem({ cart }) {
  const { currentUser } = useAuth();

  const { increaseQuantity, decreaseQuantity, clearCartItem } = useCart();

  async function handleIncreaseNumItem() {
    // num item can't exceed over related num of product
    if (currentUser) {
      await increaseQuantity(cart.id);
    } else {
      await increaseQuantity(cart.productId);
    }
  }
  async function handleDecreaseNumItem() {
    if (currentUser) {
      await decreaseQuantity(cart.id);
    } else {
      await decreaseQuantity(cart.productId);
    }
  }

  async function handleClearCartItem() {
    if (currentUser) {
      clearCartItem(cart.cartItemIds);
    } else {
      clearCartItem(cart.productId);
    }
  }

  return (
    <li className={styles.listOfItemsContainer}>
      <img className={`${styles.cartImg} `} src={`${cart?.product?.image}`} />

      <span className={styles.col_2}>
        <span className={styles.productName}>{cart?.product?.name}</span>
        <span className={styles.btnsContainer}>
          <button className={styles.minusBtn} onClick={handleDecreaseNumItem}>
            -
          </button>
          <span className={styles.numItem}>{cart.quantity ?? 1}</span>
          <button className={styles.plusBtn} onClick={handleIncreaseNumItem}>
            +
          </button>
          <button
            onClick={handleClearCartItem}
            className={styles.delete_cartItem_btn}
          >
            &times;
          </button>
        </span>
      </span>
    </li>
  );
}

export default CartSumItem;
