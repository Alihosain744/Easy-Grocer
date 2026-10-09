import Form from "./Form";

function FormAddExpense() {
  return (
    <Form
      heading="Add Expense Form"
      notePlaceHolder="Description about your expense"
      amountPlaceHolder="enter amount of expense"
      types={["Purchase Product", "Rent", "Supply", "Personal Draw"]}
    />
  );
}

export default FormAddExpense;
