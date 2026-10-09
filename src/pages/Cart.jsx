import { useState } from "react";
import styles from "./Cart.module.css";
import PageNav from "../components/PageNav";
import CartSum from "../components/CartSum";
import { useCart } from "../Contexts/CartContext";

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

// in the json server in orders should we have an image for each cartitem
// so then we can use that here

function Cart({ isMenuOpen, setIsMenuOpen }) {
  const { cart } = useCart();
  const numCartItems = cart
    ?.map((cr) => cr.quantity)
    .reduce((sum, quantity) => sum + quantity, 0);

  const [numItem, setNumItem] = useState(1);

  const [deliveryFee, setDeliveryFee] = useState(2);

  let subtotal = cart
    .map((item) => item.quantity * Number(item?.product?.price))
    .reduce((accum, total) => accum + total, 0);

  const total = subtotal + deliveryFee;

  function handleDecreaseNumItem() {
    setNumItem((numItems) => (numItems > 0 ? numItems - 1 : numItems));
  }
  function handleIncreaseNumItem() {
    setNumItem((numItems) => numItems + 1);
  }

  return (
    <>
      <PageNav
        numCartItems={numCartItems}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        className={styles.nav}
        classname={styles.nav}
      />

      <CartSum total={total} subtotal={subtotal} deliveryFee={deliveryFee} />
    </>
  );
}

export default Cart;
