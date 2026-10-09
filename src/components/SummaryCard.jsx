import { Link, useNavigate } from "react-router-dom";
import styles from "./SummaryCard.module.css";
import Message from "./Message";

import Spinner from "./Spinner";
import { useEffect } from "react";

function SummaryCard({
  showMessage = false,
  msg = "",
  title,
  today,
  month,
  year,
  buttonText,
  headers,
  data,
  isLoading = false,
  renderRow,
  renderActions,
  extraContent,
  to,
}) {
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!msg) return;

      const timer = setTimeout(function () {
        navigate(location.pathname, {
          state: { msg: null, showMessage: false },
        });
      }, 2000);

      return () => clearTimeout(timer);
    },
    [showMessage]
  );

  return (
    <section className={styles.summaryWrapper}>
      <section className={styles.summaryAlign}>
        <section className={styles.summaryContainer}>
          <h2>{title}</h2>

          <div className={styles.row_1}>
            <span>Today:</span>
            <span>{today} Af</span>
          </div>

          <div className={styles.row_2}>
            <span>This Month:</span>
            <span>{month} Af</span>
          </div>

          <div className={styles.row_3}>
            <span>This Year:</span>
            <span>{year} Af</span>
          </div>
        </section>

        <Link to={to} className={styles.btnAdd}>
          {buttonText}
        </Link>
      </section>
      {showMessage && <Message className={styles.msg} message={msg} />}
      {isLoading && <Spinner />}
      {data.length === 0 && !isLoading && (
        <Message
          className={styles.msg}
          message={
            title.trim().toLowerCase().includes("expense")
              ? "No expense exist yet click add expense to add one"
              : "No income exist yet click add income to add one "
          }
        />
      )}

      {data.length >= 1 && (
        <table className={`${styles.table} `}>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}

              {renderActions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                {renderRow(item)}

                {renderActions && <td>{renderActions(item)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {extraContent}
    </section>
  );
}

export default SummaryCard;
