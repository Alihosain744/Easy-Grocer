import { useIncome } from "../Contexts/FinanceContext";
import { useOrders } from "../Contexts/OrdersContext";
import styles from "./LoanSummary.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

function LoanSummary({ loanSummary }) {
  const { incomeLoading } = useIncome();
  const { isLoading: orderLoading } = useOrders();
  const loanSummaryLoading = incomeLoading || orderLoading;

  return (
    <section className={styles.loanSummaryContainer}>
      <h2 className={styles.loanHeading}>Customers Loan Summary</h2>
      {loanSummaryLoading && <Spinner />}
      {!loanSummaryLoading && loanSummary.length === 0 && (
        <Message className="msg" message="No loan data available" />
      )}

      {!loanSummaryLoading && loanSummary.length > 0 && (
        <table className={styles.loanTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total Paid</th>
              <th>Total Loan</th>
            </tr>
          </thead>

          <tbody>
            {loanSummary.map((ls) => (
              <tr key={ls.customer}>
                <td>{ls.customer}</td>
                <td>{ls.totalPaid}</td>
                <td>{ls.totalRemaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default LoanSummary;
