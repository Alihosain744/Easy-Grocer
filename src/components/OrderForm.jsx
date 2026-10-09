import styles from "./OrderForm.module.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Fragment, useEffect, useState } from "react";
import { useOrders } from "../Contexts/OrdersContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/UsersContext";
import { useProducts } from "../Contexts/ProductsContext";
// const users = [
//   {
//     id: 1,
//     name: "Ali",
//     email: "Ali@gmail.com",
//     password: "abc123",
//     role: "admin",
//   },
//   {
//     id: 2,
//     name: "Hassan",
//     email: "Hassan@gmail.com",
//     password: "123abc",
//     role: "admin",
//   },
//   {
//     id: 3,
//     name: "ahmad",
//     email: "ahmad@gmail.com",
//     password: "cdkef",
//     role: "user",
//   },
// ];

function OrderForm() {
  const location = useLocation();

  const { users } = useUser();
  const { products } = useProducts();

  // !! is used to turn a variable to a boolean
  const isEditing = !!location.state?.mode;

  const order_edit_data = location.state?.order;

  const { addOrder, editOrder } = useOrders();

  const navigate = useNavigate();

  const [customer, setCustomer] = useState(order_edit_data?.customer || "");

  const [phone, setPhone] = useState(order_edit_data?.phone || "");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState(order_edit_data?.cartItems || []);

  const price = product?.price || 0;

  // order_edit_data.total is already the sum of each cartItems price * quantiry + delivery fee
  // so here order_edit_data.total - cartItems.reduce((s,i)=> s + i.price * i.quantity,0)  calculates the delivery fee as of (delivery fee + each cart item (price * quantiry)) - each cart item( pice * quantity)
  const deliveryFee =
    order_edit_data?.total && order_edit_data?.cartItems
      ? order_edit_data.total -
        cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
      : 2;

  const total =
    cartItems
      .map((item) => item?.price * item.quantity)
      .reduce((accum, cur) => cur + accum, 0) + deliveryFee;

  const [paymentMethod, setPaymentMethod] = useState(
    order_edit_data?.paymentMethod || "pay now"
  );
  const [paidAmount, setPaidAmount] = useState(
    order_edit_data?.paidAmount || 0
  );

  const remain = total - paidAmount;

  const [status, setStatus] = useState(order_edit_data?.status || "pending");
  // because after adding the order the date is converted to string and now for editing the date is a string
  // so it shows the error from form validation so need to convert back the data from string to data
  const [createdAt, setCreatedAt] = useState(
    order_edit_data?.createdAt
      ? new Date(order_edit_data?.createdAt)
      : order_edit_data?.createdAt || new Date()
  );
  const [address, setAddress] = useState(order_edit_data?.address || "");

  const paymentStatus = remain <= 0 ? "Paid" : "Not-paid";

  const [errors, setErrors] = useState({});

  const cart_id =
    cartItems.length === 0
      ? 1
      : Math.max(...cartItems.map((item) => item.id)) + 1;

  useEffect(
    function () {
      // on initial render the products which is coming out of Product context
      // is an empty array, so here check if the products has something inside of
      // it and also if the product is empty or null or undefined then set the product
      // to the product at first position,
      if (products.length > 0 && !product) {
        setProduct(products[0]);
      }
    },
    [products, product]
  );

  function handle_Add_to_cart(e, newItems) {
    e.preventDefault();
    setCartItems((items) => [...items, newItems]);
  }

  function handle_delete_cart_item(e, item_delete_id) {
    e.preventDefault();
    setCartItems((items) => items.filter((item) => item.id !== item_delete_id));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!customer?.trim()) {
      newErrors.customer = "Customer name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(customer.trim())) {
      newErrors.customer = "Customer name can contain only letters and spaces";
    }

    if (cartItems.length === 0) {
      newErrors.cart = "Please add at least one item to the cart";
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      newErrors.quantity = "Quantity must be a positive whole number.";
    }

    if (isNaN(paidAmount)) {
      newErrors.paidAmount = "Paid amount must be a number.";
    } else if (paidAmount < 0) {
      newErrors.paidAmount = "Paid amount cannot be negative.";
    } else if (paidAmount > total) {
      newErrors.paidAmount = "Paid amount cannot exceed total.";
    }

    const addressRegex =
      /^House\s[0-9]+,\sStreet\s[A-Za-z0-9]+,\sDistrict\s[0-9]+,\sCity\s[A-Za-z]+$/;

    if (!address?.trim()) {
      newErrors.address = "Address is required.";
    } else if (!addressRegex.test(address.trim())) {
      newErrors.address =
        "Address format: House 20, Street nawabadcharqala, District 6, City kabul";
    }

    // House 20, Street nawabadcharqala, District 6, City kabul

    const phoneRegExp = /^07[0-9]{8}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegExp.test(phone)) {
      newErrors.phone = "Please enter a valid phone number as of 07xxxxxxxx";
    }

    if (!createdAt) {
      newErrors.createdAt = "Please select a date.";
    } else if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      newErrors.createdAt = "Please enter a valid date.";
    }

    // Object.keys assign an object and return the array of it is properties
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing) {
      const updatedOrder = {
        ...order_edit_data,
        customer,
        phone,
        cartItems,
        total,
        paidAmount,
        paymentMethod,
        status,
        paymentStatus,
        remain,
        address,
        createdAt,
      };

      try {
        await editOrder(updatedOrder);
        navigate("../orders", {
          state: {
            showMsg: true,
            msg: `Order ${order_edit_data.id} has been successfully edited`,
          },
        });
      } catch (e) {
        navigate("../orders", {
          state: { showMsg: true, msg: `Trouble while editing order` },
        });
      }
    } else {
      try {
        const already_user = users.find((u) => u.name === customer);
        const newOrder = await addOrder({
          userId: already_user ? already_user.id : "Guest",
          customer,
          phone,
          cartItems,
          total,
          paidAmount,
          paymentMethod,
          status,
          paymentStatus,
          remain,
          address,
          createdAt,
        });
        navigate(`../orders`, {
          state: {
            showMsg: true,
            msg: `Order ${newOrder.id} has been added successfully, Please navigate to Income section for 
            recording any payment`,
          },
        });
      } catch {
        navigate(`../orders`, {
          state: { showMsg: true, msg: "Trouble while adding order" },
        });
      }

      setCustomer("");
      setPhone("");
      setProduct(products[0]);
      setQuantity(1);
      setCartItems([]);
      setPaymentMethod("pay now");
      setStatus("pending");
      setPaidAmount(0);
      setCreatedAt(null);
      setAddress(null);
    }
  }

  const productNames = products.map((p) => p.name);
  const uniqueProductNames = [...new Set(productNames)];

  return (
    <form className={styles.form_add_order} onSubmit={handleSubmit}>
      <h1> {isEditing ? "Form Edit Order" : "Form Add Order"}</h1>
      <div className={styles.col}>
        <label>Customer</label>
        <input
          list="customers"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          type="text"
          placeholder="Enter customer name"
        />

        <datalist id="customers">
          {users.map((user) => (
            <option key={user.id} value={user.name} />
          ))}
        </datalist>
        <p className={styles.error}>{errors.customer}</p>
      </div>
      <div className={styles.col}>
        <label>Phone No</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className={styles.error}>{errors.phone}</p>
      </div>
      <section className={styles.cart_items}>
        <div className={styles.col}>
          <label>Product</label>

          <select
            value={product?.name}
            onChange={(e) => {
              const found = products?.find((p) => p?.name === e.target.value);
              setProduct(found);
            }}
          >
            {uniqueProductNames.map((product, i) => (
              <option value={product} key={i}>
                {product}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.col}>
          <label>Price</label>
          <input value={price} readOnly type="number" />
        </div>
        <div className={styles.col}>
          <label>Quantity</label>
          <input
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            type="number"
          />
        </div>

        <button
          onClick={(e) =>
            handle_Add_to_cart(e, {
              id: cart_id,
              name: product?.name,
              price,
              quantity,
            })
          }
          className={styles.add_to_cart}
        >
          +
        </button>
      </section>
      {/* ////// cart section */}
      <section className={`${styles.col} ${styles.cart}`}>
        <h3>Cart Items</h3>
        {cartItems.map((item) => (
          <Fragment key={item.id}>
            <div className={styles.row}>
              <label>Product</label>{" "}
              <span className={styles.cart_value}>{item.name}</span>
            </div>
            <div className={styles.row}>
              <label>Price</label>{" "}
              <span className={styles.cart_value}>{item.price} AF</span>
            </div>
            <div className={styles.row}>
              <label>Quantity</label>{" "}
              <span className={styles.cart_value}>{item.quantity}</span>
            </div>
            <button
              className={styles.delete_item_btn}
              onClick={(e) => handle_delete_cart_item(e, item.id)}
            >
              X
            </button>
          </Fragment>
        ))}
      </section>
      <p className={styles.error}>{errors.cart}</p>
      <div className={styles.col}>
        <label>Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="pay now">Pay now</option>
          <option value="pay later">Pay later</option>
          <option value="cod">COD (Cash On Delivery)</option>
        </select>
      </div>
      <div className={styles.col}>
        <label>Total</label>
        <input type="number" value={total} readOnly />
      </div>
      <div className={styles.col}>
        <label>Paid Amount</label>
        <input
          value={paidAmount}
          onChange={(e) => setPaidAmount(Number(e.target.value))}
          type="number"
          placeholder="Paid amount"
        />
        <p className={styles.error}>{errors.paidAmount}</p>
      </div>
      <div className={styles.col}>
        <label>Remaining</label>
        <input type="number" value={remain} readOnly />
      </div>
      <div className={styles.col}>
        <label>Order Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <div className={styles.col}>
        <label>Payment Status</label>
        <input value={paymentStatus} type="text" readOnly />
      </div>
      <div className={styles.col}>
        <label>Address</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="address"
          placeholder="enter the address of delivery place"
        />
        <p className={styles.error}>{errors.address}</p>
      </div>
      <div className={styles.col}>
        <label>Date</label>
        <DatePicker
          selected={createdAt}
          onChange={(date) => setCreatedAt(date)}
          dateFormat="dd/MM/yyyy"
          strictParsing
        />
        <p className={styles.error}>{errors.createdAt}</p>
      </div>
      <button className={styles.add_order}>
        {isEditing ? "Edit Order" : "Add Order"}
      </button>
    </form>
  );
}

export default OrderForm;
