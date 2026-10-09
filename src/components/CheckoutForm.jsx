import { useState } from "react";
import styles from "./CheckoutForm.module.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Contexts/CartContext";
import { useOrders } from "../Contexts/OrdersContext";
import { useAuth } from "../Contexts/AuthContext";

function CheckoutForm() {
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();

  const deliveryFee = 2;
  const subtotal =
    cart
      ?.map((item) => item.quantity * Number(item?.product?.price))
      .reduce((sum, cur) => sum + cur, 0) ?? 0;
  const { addOrder } = useOrders();

  const total = deliveryFee + subtotal;
  const { currentUser } = useAuth();

  const hasItemInCart = cart?.length > 0;

  const [payLater, setPayLater] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pay-now");
  const [error, setError] = useState({});

  const remain = paidAmount <= Number(total) && Number(total) - paidAmount;

  function handlePayLater() {
    setPayLater(true);
  }

  function handleRemovePayLater() {
    setPayLater(false);
  }
  async function handleProceedOrder(e) {
    e.preventDefault();

    const newErrors = {};
    // currently items are stored in cart
    const cartItemsForOrder = cart.map((item) => ({
      id: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const fullNameRegExp = /^[a-zA-Z\s]+$/;

    if (!fullName.trim()) {
      newErrors.fullName = "fullName name is required";
    } else if (!fullNameRegExp.test(fullName.trim())) {
      newErrors.fullName =
        "fullName name can only contain upper case and lower case letters";
    }

    const phoneRegExp = /^07[0-9]{8}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegExp.test(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number as of 07xxxxxxxx";
    }

    const addressRegex =
      /^House\s[0-9]+,\sStreet\s[A-Za-z0-9]+,\sDistrict\s[0-9]+,\sCity\s[A-Za-z]+$/;

    if (!address?.trim()) {
      newErrors.address = "Address is required.";
    } else if (!addressRegex.test(address.trim())) {
      newErrors.address =
        "Delivery address format: House 20, Street nawabadcharqala, District 6, City kabul";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    const order = {
      userId: currentUser ? currentUser.id : "Guest",
      customer:
        currentUser && currentUser.role !== "admin"
          ? currentUser.name
          : fullName,
      phone,
      cartItems: cartItemsForOrder,
      total,
      paidAmount: paymentMethod === "pay-later" ? paidAmount : total,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "pay-later" ? "Not-paid" : "paid",
      remain: paymentMethod === "pay-later" ? Number(total) - paidAmount : 0,
      address: address,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    try {
      await addOrder(order);

      await clearCart();
      setFullName("");
      setPhone("");
      setAddress("");
      setPaymentMethod("pay-now");
      setError({});
      navigate("../", {
        state: { msg: "Order has been added succesfully", showMsg: true },
      });
    } catch (e) {
      console.log(e);
      navigate("../", {
        state: { msg: "Trouble while adding order", showMsg: true },
      });
    }
  }
  return (
    <>
      {hasItemInCart && (
        <form className={styles.checkoutForm}>
          <div className={styles.col}>
            <label>FullName</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder="enter your full name"
            />
            <p className={styles.error}>{error.fullName}</p>
          </div>
          <div className={styles.col}>
            <label>Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="enter your full name"
            />
            <p className={styles.error}>{error.phone}</p>
          </div>
          <div className={styles.col}>
            <label>Delivery Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="enter your address for delivery"
            />
            <p className={styles.error}>{error.address}</p>
          </div>

          <div className={styles.col_4}>
            <label>Payment Method </label>

            <label className={styles.option}>
              <input
                onClick={handleRemovePayLater}
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                value="cod"
                name="payment"
              />
              COD(Cash On Delivery)
            </label>

            <label className={styles.option}>
              <input
                onClick={handleRemovePayLater}
                type="radio"
                checked={paymentMethod === "pay-now"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                value="pay-now"
                name="payment"
              />{" "}
              Pay Now
            </label>

            <label className={styles.option}>
              <input
                onClick={handlePayLater}
                type="radio"
                checked={paymentMethod === "pay-later"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                value="pay-later"
                name="payment"
              />{" "}
              Pay Later
            </label>
          </div>

          {payLater && (
            <>
              <div className={styles.col}>
                <label>Payment Amount</label>
                <input
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  type="number"
                  placeholder="enter payment amount"
                />
              </div>
              <div className={styles.col}>
                <label>Remaining Amount</label>
                <input
                  value={remain}
                  type="number"
                  disabled
                  placeholder="remaining amount"
                />
              </div>
            </>
          )}

          <button
            onClick={(e) => handleProceedOrder(e)}
            className={styles.orderBtn}
          >
            Proceed Order
          </button>
        </form>
      )}
    </>
  );
}

export default CheckoutForm;
