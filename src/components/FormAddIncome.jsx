import Form from "./Form";

function FormAddIncome() {
  return (
    <Form
      heading="Add Income Form"
      notePlaceHolder="Description about your income"
      amountPlaceHolder="enter amount of income"
      types={[]}
    />
  );
}

export default FormAddIncome;
