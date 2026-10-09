// both expenses and incomes are stored here

import { useReducer } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useOrders } from "./OrdersContext";

const BASE_URL = "http://localhost:9000";

const ExpenseContext = createContext();
const initialExpenseState = {
  expenseLoading: false,
  expenses: [],
};

function expenseReducer(state, action) {
  switch (action.type) {
    case "expense/loading":
      return {
        ...state,
        expenseLoading: true,
      };

    case "expense/loaded":
      return {
        ...state,
        expenseLoading: false,
        expenses: action.payload,
      };

    case "expense/added":
      return {
        ...state,
        expenseLoading: false,
        expenses: [...state.expenses, action.payload],
      };
    case "expense/deleted":
      return {
        ...state,
        expenseLoading: false,
        expenses: state.expenses.filter((exp) => exp.id !== action.payload),
      };
    case "expense/edited":
      return {
        expenseLoading: false,
        expenses: state.expenses.map((exp) =>
          exp.id === action.payload.id ? action.payload : exp
        ),
      };
    case "error":
      return {
        ...state,
        expenseLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
function ExpenseProvider({ children }) {
  const [{ expenseLoading, expenses }, dispatch] = useReducer(
    expenseReducer,
    initialExpenseState
  );

  useEffect(function () {
    async function loadExpenses() {
      dispatch({ type: "expense/loading" });
      try {
        const res = await fetch(`${BASE_URL}/expenses`);
        if (!res.ok) throw new Error("Couldn't load expenses");

        const data = await res.json();
        dispatch({ type: "expense/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "error" });
        throw e;
      }
    }
    loadExpenses();
  }, []);

  async function addExpense(expense) {
    dispatch({ type: "expense/loading" });
    let data;
    try {
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });

      if (!res.ok) throw new Error("Couldn't add expense");

      data = await res.json();

      dispatch({ type: "expense/added", payload: data });
    } catch (e) {
      dispatch({ type: "error" });
      throw e;
    }
    return data;
  }

  async function deleteExpense(id) {
    dispatch({ type: "expense/loading" });
    try {
      const res = await fetch(`${BASE_URL}/expenses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Couldn't delete the expense");

      dispatch({ type: "expense/deleted", payload: id });
    } catch (e) {
      dispatch({ type: "error" });
      throw e;
    }
  }

  async function editExpense(expense) {
    dispatch({ type: "expense/loading" });
    let data;
    try {
      const res = await fetch(`${BASE_URL}/expenses/${expense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      if (!res.ok) throw new Error("Couldn't edit the expense");

      data = await res.json();

      dispatch({ type: "expense/edited", payload: data });
    } catch (e) {
      dispatch({ type: "error" });
      throw e;
    }
    return data;
  }
  return (
    <ExpenseContext.Provider
      value={{
        addExpense,
        expenseLoading,
        expenses,
        deleteExpense,
        editExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

function useExpense() {
  const context = useContext(ExpenseContext);

  if (context === undefined)
    throw new Error("Expense Context is used out of it is provider");

  return context;
}

const IncomeContext = createContext();
const initialIncomeState = {
  incomeLoading: false,
  incomes: [],
};

function incomeReducer(state, action) {
  switch (action.type) {
    case "income/loading":
      return {
        ...state,
        incomeLoading: true,
      };

    case "income/loaded":
      return {
        ...state,
        incomeLoading: false,
        incomes: action.payload,
      };

    case "income/added":
      return {
        ...state,
        incomeLoading: false,
        incomes: [...state.incomes, action.payload],
      };
    case "income/deleted":
      return {
        ...state,
        incomeLoading: false,
        incomes: state.incomes.filter((inc) => inc.id !== action.payload),
      };
    case "income/edited":
      return {
        incomeLoading: false,
        incomes: state.incomes.map((inc) =>
          inc.id === action.payload.id ? action.payload : inc
        ),
      };
    case "error":
      return {
        ...state,
        incomeLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
function IncomeProvider({ children }) {
  const [{ incomeLoading, incomes }, dispatch] = useReducer(
    incomeReducer,
    initialIncomeState
  );
  const { updateOrderPayment } = useOrders();

  useEffect(function () {
    async function loadIncomes() {
      dispatch({ type: "income/loading" });
      try {
        const res = await fetch(`${BASE_URL}/incomes`);
        if (!res.ok) throw new Error("Couldn't load incomes");

        const data = await res.json();
        dispatch({ type: "income/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "error" });
        throw e;
      }
    }
    loadIncomes();
  }, []);

  async function addIncome(income) {
    dispatch({ type: "income/loading" });
    let data;
    try {
      const res = await fetch(`${BASE_URL}/incomes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(income),
      });

      if (!res.ok) throw new Error("Couldn't add income");

      data = await res.json();

      dispatch({ type: "income/added", payload: data });

      const newIncome = await updateOrderPayment(income.orderId, income.amount);

      return newIncome;
    } catch (e) {
      dispatch({ type: "error" });
      throw e;
    }
  }

  async function deleteIncome(id) {
    dispatch({ type: "income/loading" });
    try {
      const incomeToDelete = incomes.find((inc) => inc.id === id);
      if (!incomeToDelete) throw new Error("Couldn't found the income");

      const res = await fetch(`${BASE_URL}/incomes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Couldn't delete the income");

      dispatch({ type: "income/deleted", payload: id });

      const amount = Number(incomeToDelete.amount);
      //after deleting an income, reflect the changes to the orders too,
      // - because for the removal of an income instead of adding paidAmount, do a subtraction for the
      // paid amount
      updateOrderPayment(incomeToDelete.orderId, -amount);
    } catch (e) {
      dispatch({ type: "error" });
      throw e;
    }
  }

  async function editIncome(income) {
    dispatch({ type: "income/loading" });
    //  this is the income before any changes come in to it
    const oldIncome = incomes.find((inc) => inc.id === income.id);
    const oldAmount = oldIncome?.amount ?? 0;

    let updatedIncome;
    try {
      const res = await fetch(`${BASE_URL}/incomes/${income.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(income),
      });

      if (!res.ok) throw new Error("Couldn't edit the income");

      updatedIncome = await res.json();

      const delta = Number(updatedIncome.amount) - Number(oldAmount);
      // assume the order total was 1000, and paidAmount is 700 (300 + 400 two payments)
      //so if i want to update the 400 income to 600 then I first find the old income amount
      // which is 400 and then subtract it from updatedincome amount which is 600, so 600 - 400 becomes
      // 200, now the result is send as the second argument of updateOrderPayment method so it adds the
      // order paidAmount by that, so 700 + 200 which becomes 900, So Here I have updated the second income
      // from 400 to 600 which in turn causes to update the order paidAmount,
      // reflect only the difference to related order
      await updateOrderPayment(updatedIncome.orderId, delta);

      dispatch({ type: "income/edited", payload: updatedIncome });
    } catch (e) {
      dispatch({ type: "error" });
      throw e;
    }
    return updatedIncome;
  }
  return (
    <IncomeContext.Provider
      value={{
        addIncome,
        incomeLoading,
        incomes,
        deleteIncome,
        editIncome,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
}

function useIncome() {
  const context = useContext(IncomeContext);

  if (context === undefined)
    throw new Error("Income Context is used out of it is provider");

  return context;
}

export { ExpenseProvider, useExpense, IncomeProvider, useIncome };
