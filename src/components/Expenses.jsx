import SummaryCard from "./SummaryCard";
import styles from "./Expenses.module.css";
import Modal from "./Modal";
import { useExpense } from "../Contexts/FinanceContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useSummary from "../hooks/useSummary";

function Expenses() {
  const { expenses, deleteExpense, expenseLoading } = useExpense();

  const location = useLocation();
  const navigate = useNavigate();

  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const {
    today: todaysExpenses,
    this_month: this_month_expenses,
    this_year: this_year_expenses,
  } = useSummary(expenses);

  function handle_edit_expense(expense) {
    navigate("../addExpense", {
      state: { expenseToEdit: expense, mode: "edit" },
    });
  }

  function handle_delete_expense(expense) {
    setIsModalOpen(true);
    setExpenseToDelete(expense);
  }

  async function onConfirm() {
    try {
      await deleteExpense(expenseToDelete.id);
      setIsModalOpen(false);
      navigate(location.pathname, {
        state: { msg: "Expense is deleted successfully", showMessage: true },
      });
    } catch (e) {
      navigate(location.pathname, {
        state: { msg: e.message, showMessage: true },
      });
    }
  }
  return (
    <>
      <Modal
        onConfirm={onConfirm}
        IsModalOpen={IsModalOpen}
        setIsModalOpen={setIsModalOpen}
        mode="delete"
      />
      <SummaryCard
        msg={location?.state?.msg}
        showMessage={location?.state?.showMessage}
        title="Expense Summary"
        today={todaysExpenses}
        month={this_month_expenses}
        year={this_year_expenses}
        buttonText="Add Expense"
        isLoading={expenseLoading}
        headers={["Amount", "Date", "Type", "Note"]}
        data={expenses}
        renderRow={(expense) => (
          <>
            <td>{expense.amount}</td>
            <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
            <td>{expense.type}</td>
            <td>{expense.note}</td>
          </>
        )}
        to="../addExpense"
        renderActions={(expense) => (
          <>
            <button
              onClick={() => handle_edit_expense(expense)}
              className={styles.action}
            >
              Edit
            </button>
            <button
              onClick={() => handle_delete_expense(expense)}
              className={styles.action}
            >
              Delete
            </button>
          </>
        )}
      />
    </>
  );
}

export default Expenses;
