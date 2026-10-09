import styles from "./Form.module.css";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { useExpense, useIncome } from "../Contexts/FinanceContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useOrders } from "../Contexts/OrdersContext";

function Form({ amountPlaceHolder, notePlaceHolder, heading, types }) {
  const { addExpense, editExpense } = useExpense();
  const { orders } = useOrders();
  const { addIncome, editIncome } = useIncome();

  const navigate = useNavigate();
  const location = useLocation();
  const mode = location?.state?.mode;

  const isFormIncome = heading.trim().toLowerCase().includes("income");
  const isFormExpense = heading.trim().toLowerCase().includes("expense");

  const expenseToEdit = location?.state?.expenseToEdit;
  const incomeToEdit = location?.state?.incomeToEdit;

  const itemToEdit = isFormIncome ? incomeToEdit : expenseToEdit;

  const [orderId, setOrderId] = useState(orders[0]?.id);

  const [customer, setCustomer] = useState(orders[0]?.customer ?? "");

  const [date, setDate] = useState(
    mode === "edit" ? new Date(itemToEdit?.date) : new Date()
  );
  const [amount, setAmount] = useState(() => {
    if (mode === "edit") {
      return itemToEdit?.amount ?? "";
    }
    if (isFormIncome) {
      const selectedOrder = orders.find(
        (order) => order.id === Number(orderId)
      );
      return selectedOrder?.remain ?? "";
    }
    return "";
  });

  const [type, setType] = useState(
    mode === "edit" ? itemToEdit?.type : types[0]
  );

  const [note, setNote] = useState(itemToEdit?.note ?? "");
  const [error, setError] = useState({});

  useEffect(
    function () {
      const selectedOrder = orders.find(
        (order) => order.id === Number(orderId)
      );
      if (selectedOrder && mode !== "edit" && isFormIncome) {
        setAmount(selectedOrder.remain);
        setCustomer(selectedOrder.customer);
      }
    },
    [orderId, orders]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    const newError = {};

    if (date === null) {
      newError.date = "Date is required";
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      newError.date = "Enter a valid date as of dd/mm/YYYY";
    }
    const amountRegExp = /^[0-9]+$/;

    if (!amount.toString().trim()) {
      newError.amount = "Amount is required";
    } else if (!amountRegExp.test(amount)) {
      newError.amount = "Amount can only contain numbers";
    }

    const noteRegExp = /^[a-zA-Z0-9\s\n,]+$/;
    if (!noteRegExp.test(note)) {
      newError.note =
        "Note can only contain letters, digits space, enter and ,";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    if (isFormExpense) {
      if (location?.state?.mode === "edit") {
        try {
          await editExpense({ ...expenseToEdit, date, type, amount, note });
          navigate("../expenses", {
            state: { msg: "Expense is edited successfully", showMessage: true },
          });
        } catch (e) {
          setError({ expenseAddErr: e.message });
          navigate("../expenses", {
            state: { msg: e.message, showMessage: true },
          });
        }
      } else {
        try {
          await addExpense({ date, amount, type, note });
          navigate("../expenses", {
            state: { msg: "Expense is added successfully", showMessage: true },
          });
        } catch (e) {
          setError({ expenseAddErr: e.message });
          navigate("../expenses", {
            state: { msg: e.message, showMessage: true },
          });
        }
      }
    } else if (isFormIncome) {
      const selectedOrder = orders.find((o) => o.id === Number(orderId));
      const userId = selectedOrder.userId;
      const convertedOrderId = Number(orderId);

      if (location?.state?.mode === "edit") {
        try {
          await editIncome({
            ...incomeToEdit,
            userId,
            orderId: convertedOrderId,
            customer,
            date,
            amount,
          });
          navigate("../incomes", {
            state: { msg: "Income is edited successfully", showMessage: true },
          });
        } catch (e) {
          setError({ expenseAddErr: e.message });
          navigate("../incomes", {
            state: { msg: e.message, showMessage: true },
          });
        }
      } else {
        // const selectedOrder = orders.find((o) => o.id === Number(orderId));
        // const userId = selectedOrder.userId;

        const selectedOrder = orders.find((o) => o.id === Number(orderId));
        const userId = selectedOrder.userId;

        const convertedOrderId = Number(orderId);

        try {
          await addIncome({
            userId,
            orderId: convertedOrderId,
            customer,
            date,
            amount,
            note,
          });

          navigate("../incomes", {
            state: {
              msg: "Income has been added successfully",
              showMessage: true,
            },
          });
        } catch (e) {
          navigate("../incomes", {
            state: { msg: e.message, showMessage: true },
          });
        }
      }
    }
  }

  if (isFormIncome && orders.length === 0)
    return (
      <form className={styles.form}>
        <h1>Add Income</h1>
        <p className={styles.infoMsg}>
          There are no orders yet, Please{" "}
          <Link to="../addOrder">add an order</Link> first before recording an
          income
        </p>
      </form>
    );
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>
        {isFormExpense && mode === "edit" && "Edit Expense Form"}
        {isFormIncome && mode === "edit" && "Edit Income Form"}
        {isFormExpense && !mode && heading}
        {isFormIncome && !mode && heading}
      </h1>
      {isFormIncome && (
        <div className={styles.col}>
          <label>Order</label>
          <select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
            {orders.map((order) => (
              <option key={order.id}>{order.id}</option>
            ))}
          </select>
        </div>
      )}
      {isFormIncome && (
        <div className={styles.col}>
          <label>Customer</label>
          <input type="text" value={customer} disabled />
        </div>
      )}
      <div className={styles.col}>
        <label>Amount</label>
        <input
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          type="number"
          placeholder={amountPlaceHolder}
        />
        <p className={styles.err}>{error.amount}</p>
      </div>
      {isFormExpense && (
        <div className={styles.col}>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {types?.map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className={styles.col}>
        <label>Date</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyy"
        />
        <p className={styles.err}>{error.date}</p>
      </div>

      <div className={styles.col}>
        <label>Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={notePlaceHolder}
        />
        <p className={styles.err}>{error.note}</p>
      </div>

      <button className={styles.formBtn}>Done</button>
    </form>
  );
}

export default Form;
