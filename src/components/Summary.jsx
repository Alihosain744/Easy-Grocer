import { useExpense, useIncome } from "../Contexts/FinanceContext";
import { useOrders } from "../Contexts/OrdersContext";
import useLoanSummary from "../hooks/useLoanSummary";
import useSummary from "../hooks/useSummary";
import LoanSummary from "./LoanSummary";
import styles from "./Summary.module.css";
import SummaryCard from "./SummaryCard";

function Summary() {
  const { incomes, incomeLoading } = useIncome();
  const { expenses, expenseLoading } = useExpense();

  const { orders } = useOrders();

  const loanSummary = useLoanSummary(incomes, orders);

  const {
    today: todaysIncomes,
    this_month: this_month_incomes,
    this_year: this_year_incomes,
  } = useSummary(incomes);
  const {
    today: todaysExpenses,
    this_month: this_month_expenses,
    this_year: this_year_expenses,
  } = useSummary(expenses);

  const total_received = incomes.reduce(
    (total, inc) => Number(inc.amount) + total,
    0
  );

  const total_expense = expenses.reduce(
    (total, exp) => total + Number(exp.amount),
    0
  );

  return (
    <main className={styles.parentContainer}>
      <main className={styles.summaryContainer}>
        <section className={styles.leftSide}>
          <SummaryCard
            title="Expense Summary"
            today={todaysExpenses}
            month={this_month_expenses}
            year={this_year_expenses}
            buttonText="Add Expense"
            isLoading={expenseLoading}
            headers={["Amount", "Date", "Type", "Note"]}
            data={expenses}
            renderRow={(expense, i) => (
              <>
                <td>{expense.amount}</td>
                <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
                <td>{expense.type}</td>
                <td>{expense.note}</td>
              </>
            )}
            to="../addExpense"
            extraContent={
              <div className={styles.total}>
                <div>
                  <span>Total expense:</span>
                  <span>{total_expense} AF</span>
                </div>
              </div>
            }
          />
        </section>

        <section className={styles.rightSide}>
          <SummaryCard
            title="Income Summary"
            today={todaysIncomes}
            month={this_month_incomes}
            year={this_year_incomes}
            buttonText="Add Income"
            isLoading={incomeLoading}
            headers={["Customer", "Date", "Order", "Amount", "Note"]}
            data={incomes}
            renderRow={(income, i) => (
              <>
                <td>{income.customer}</td>
                <td>{new Date(income.date).toLocaleDateString("en-GB")}</td>
                <td>{income.orderId}</td>
                <td>{income.amount}</td>
                <td>{income.note}</td>
              </>
            )}
            extraContent={
              <div className={styles.total}>
                <div>
                  <span>Total Received:</span>
                  <span>{total_received} AF</span>
                </div>
              </div>
            }
            to="../addIncome"
          />
        </section>
      </main>

      <LoanSummary loanSummary={loanSummary} />
    </main>
  );
}

export default Summary;
