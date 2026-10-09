

function useLoanSummary(incomes, orders) {
  const summary = {};

  // summary is an object like {2: {customer: "ali",totalPaid:200,totalRemaining:100}}
  incomes.forEach((income) => {
    const key = income.userId;

    // if there is no summary object for a userId, then create one,
    if (!summary[key]) {
      summary[key] = {
        customer: income.customer,
        totalPaid: 0,
        totalRemaining: 0,
      };
    }
    // otherwise add income amount to the totalPaid property of summary object
    summary[key].totalPaid += Number(income.amount);
  });

  orders.forEach((order) => {
    const key = order.userId;

    // first create a summary object for the related order 
    if (!summary[key]) {
      summary[key] = {
        customer: order.customer,
        totalPaid: 0,
        totalRemaining: 0,
      };
    }
    summary[key].totalRemaining += Number(order.remain);
    // then add order remain to the totalRemaining property of summary object
  });

  // since summary object is {2: {customer:"ali",totalPaid:100, totalRemaining:200},3:{customer:"ahmad",totalPaid:300,totalRemaining:300}}
  // so here only takes the property values into an array so further can map through it easily
  return Object.values(summary);
}

export default useLoanSummary;
