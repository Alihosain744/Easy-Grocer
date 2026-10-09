import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./CartSum.module.css";
import CartSumItem from "./CartSumItem";
import Message from "./Message";
import { useCart } from "../Contexts/CartContext";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";

// const cartItems = [
//   {
//     product: "Apple",
//     image: "../ginseng.jpeg",
//     quantity: 4,
//     price: 25,
//   },
//   {
//     product: "Milk",
//     image: "../ginseng.jpeg",
//     quantity: 1,
//     price: 20,
//   },
//   {
//     product: "Chocolate",
//     image: "../xbull.jpeg",
//     quantity: 1,
//     price: 100,
//   },
// ];

function CartSum({ className = "", total = 0, subtotal = 0, deliveryFee = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { cart: cartItems, cartLoading, clearCart } = useCart();

  const hasItemInCart = cartItems.length > 0;

  // Here both showMsg and msg are stored in this component local state in order to survivd later
  // because these are depend to browser history entry and will be wipe out.
  const [showMsg, setShowMsg] = useState(location?.state?.showMsg ?? false);
  const [msgText, setMsgText] = useState(location?.state?.msg ?? "");

  function getUniqueCartItems(cartItems) {
    // merged Map is look like {productId => {cartItem} }
    // {3,{userId:103,quantity:6,id:15,product:{id:1,name:"Ginseng",description:"ginseng energy drink",image:"./ginseng.jpeg"} }}
    const merged = new Map();

    for (const item of cartItems) {
      // if the current item product id in the loop is already exist in the merged Map, then
      // get out that item from the merged Map and add the current item quantity to that item quantity
      // and also add  cartItemsIds property to that object and push the current item id that will further
      // use for deleting and updating of item
      if (merged.has(item.productId)) {
        const existing = merged.get(item.productId);

        existing.quantity += item.quantity;

        existing.cartItemIds.push(item.id);
      } else {
        // but if the item is not already in the merged Map, then just copy the item to the merged Map
        // with the related item id
        merged.set(item.productId, {
          ...item,
          cartItemIds: [item.id],
        });
      }
    }

    // take only values from the Map and then convert them to array and return them.
    return Array.from(merged.values());
  }

  async function handleClearCart() {
    await clearCart();
  }

  useEffect(
    function () {
      if (!location?.state?.showMsg) return;

      setShowMsg(true);
      // because in the below I cleared the browser history then the msg needs to be stored in UI state
      //
      setMsgText(location?.state?.msg);

      // Remove showMsg from this history entry so it can't reappear
      // when the user uses back and forward button to come to this page, then the already
      // message should not be shown again,
      navigate(location.pathname, { replace: true, state: {} });

      const timer = setTimeout(function () {
        setShowMsg(false);
      }, 3000);

      return () => clearTimeout(timer);
    },
    [location?.state?.showMsg]
  );
  return (
    <main className={styles.cartContainer}>
      <section className={styles.wrapper_1}>
        <h1 className={styles.cartHeading}>
          {!showMsg && "List of cart items"}
        </h1>

        <ul className={`${styles.listOfItems} ${className}`}>
          {cartItems.length >= 1 && (
            <p onClick={handleClearCart} className={styles.clearCart}>
              Clear Cart
            </p>
          )}

          {cartLoading && <Spinner />}
          {showMsg && <Message message={msgText} className="msg" />}

          {cartItems.length === 0 && !cartLoading && !showMsg && (
            <Message
              message="No items added yet to the cart! "
              className="msg"
            />
          )}

          {getUniqueCartItems(cartItems).map((cart, index) => (
            <CartSumItem cart={cart} key={index} />
          ))}
        </ul>
      </section>

      {hasItemInCart && (
        <section className={styles.wrapper_2}>
          <section className={styles.summary}>
            <h1 className={styles.summaryHeading}> Summary</h1>

            <section className={styles.summaryContainer}>
              <span className={styles.row}>
                <span>Subtotal:</span>
                <span className={styles.bold}>{subtotal} Af</span>
              </span>

              <span className={styles.row}>
                <span>Delivery Fee:</span>
                <span className={styles.bold}>{deliveryFee} Af</span>
              </span>

              <span className={styles.row}>
                <span>Total:</span>
                <span className={styles.bold}>{total} Af</span>
              </span>
              <Link to="form" className={styles.checkoutBtn}>
                Checkout
              </Link>
            </section>
          </section>
        </section>
      )}

      <Outlet />
    </main>
  );
}

export default CartSum;
