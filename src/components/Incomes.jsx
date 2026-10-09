import SummaryCard from "./SummaryCard";
import styles from "./Incomes.module.css";
import { useIncome } from "../Contexts/FinanceContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";
import useSummary from "../hooks/useSummary";
// const incomes = [
//   {
//     customer: "ali",
//     date: "2026/ 03/1",
//     order: 101,
//     type: "COD",
//     amount: 100,
//     paid: 100,
//     remain: 0,
//     note: "sold jam and cream",
//   },

//   {
//     customer: "ahmad",
//     date: "2026/ 02/30",
//     order: 102,
//     type: " Pay now",
//     amount: "50",
//     paid: "50",
//     remain: 0,
//     note: "sold yoghurt",
//   },
//   {
//     customer: "mahmood",
//     date: "2026/ 04/12",
//     order: 103,
//     type: " pay later",
//     amount: 150,
//     paid: 0,
//     remain: 150,
//     note: "energy and washing liquid",
//   },
//   {
//     customer: "elham",
//     date: "2026/ 1/12",
//     order: 104,
//     type: "pay later",
//     amount: 0,
//     paid: 0,
//     remain: 0,
//     note: "purchasing product for the shop",
//   },
//   {
//     customer: "elham",
//     date: "2026/ 1/13",
//     order: 104,
//     type: "pay later",
//     amount: 1700,
//     paid: 1700,
//     remain: 0,
//     note: "purchasing product for the shop",
//   },
// ];

function Incomes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { incomes, deleteIncome, incomeLoading } = useIncome();
  const total_income = incomes.reduce(
    (total, income) => Number(income.amount) + total,
    0
  );

  const {
    today: todaysIncomes,
    this_month: this_month_incomes,
    this_year: this_year_incomes,
  } = useSummary(incomes);

  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  function handle_edit_income(income) {
    navigate("../addIncome", {
      state: { incomeToEdit: income, mode: "edit" },
    });
  }

  function handle_delete_income(income) {
    setIsModalOpen(true);
    setIncomeToDelete(income);
  }

  async function onConfirm() {
    try {
      await deleteIncome(incomeToDelete.id);
      setIsModalOpen(false);
      navigate(location.pathname, {
        state: { msg: "Income is deleted successfully", showMessage: true },
      });
    } catch (e) {
      navigate(location.pathname, {
        state: { msg: e.message, showMessage: true },
      });
    }
  }

  return (
    <div>
      <Modal
        onConfirm={onConfirm}
        IsModalOpen={IsModalOpen}
        setIsModalOpen={setIsModalOpen}
        mode="delete"
      />
      <SummaryCard
        msg={location?.state?.msg}
        showMessage={location?.state?.showMessage}
        title="Income Summary"
        today={todaysIncomes}
        month={this_month_incomes}
        year={this_year_incomes}
        isLoading={incomeLoading}
        buttonText="Add Income"
        headers={["Customer", "Date", "Order", "Amount", "Note"]}
        data={incomes}
        renderRow={(income) => (
          <>
            <td>{income.customer}</td>
            <td>{new Date(income.date).toLocaleDateString("en-GB")}</td>
            <td>{income.orderId}</td>
            <td>{income.amount}</td>
            <td>{income.note}</td>
          </>
        )}
        renderActions={(income) => (
          <>
            <button
              onClick={(e) => handle_edit_income(income)}
              className={styles.action}
            >
              Edit
            </button>
            <button
              onClick={(e) => handle_delete_income(income)}
              className={styles.action}
            >
              Delete
            </button>
          </>
        )}
        extraContent={
          <div className={styles.total_received}>
            {incomes.length >= 1 && (
              <div>
                <span>Total Received:</span>
                <span>{total_income} AF</span>
              </div>
            )}
          </div>
        }
        to="../addIncome"
      />
    </div>
  );
}

export default Incomes;
