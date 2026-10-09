function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isSameMonth(d, ref) {
  return (
    d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
  );
}

function isSameYear(d, ref) {
  return d.getFullYear() === ref.getFullYear();
}

function useSummary(transactions) {
  const now = new Date();

  const today = transactions
    .filter((tr) => isSameDay(new Date(tr.date), now))
    .reduce((total, tr) => Number(tr.amount) + total, 0);

  const this_month = transactions
    .filter((tr) => isSameMonth(new Date(tr.date), now))
    .reduce((total, tr) => total + Number(tr.amount), 0);

  const this_year = transactions
    .filter((tr) => isSameYear(new Date(tr.date), now))
    .reduce((total, tr) => total + Number(tr.amount), 0);

  return { today, this_month, this_year };
}

export default useSummary;
