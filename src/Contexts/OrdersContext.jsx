import { useEffect, useReducer, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

const BASE_URL = "http://localhost:9000";
const initialState = { orders: [], error: null, isLoading: false };

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "orders/loaded":
      return {
        ...state,
        isLoading: false,
        orders: action.payload,
      };

    case "order/added":
      return {
        ...state,
        isLoading: false,
        orders: [...(state.orders ?? []), action.payload],
      };

    case "order/deleted":
      return {
        ...state,
        isLoading: false,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };

    case "order/edited":
      return {
        ...state,
        isLoading: false,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
      };
    case "orderPayment/updated":
      return {
        ...state,
        isLoading: false,
        orders: state.orders.map((o) =>
          o.id === action.payload.id ? action.payload : o
        ),
      };
    case "error":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
  }
}
function OrderProvider({ children }) {
  const { currentUser } = useAuth();
  const [{ orders, error, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [filterOption, setFilterOption] = useState("customer");

  const [filter, setFilter] = useState("");

  useEffect(
    function () {
      if (orders?.length > 0 && filterOption === "customer") {
        setFilter("all_customers");
      } else if (orders?.length > 0 && filterOption === "status") {
        setFilter("all_status");
      }
    },
    [orders, filterOption]
  );
  useEffect(function () {
    async function loadOrders() {
      dispatch({ type: "loading" });
      if (currentUser?.role !== "admin") return;

      let data;
      try {
        const res = await fetch(`${BASE_URL}/orders`);
        data = await res.json();

        dispatch({ type: "orders/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
      }
    }
    loadOrders();
  }, []);

  // load orders for logged in users
  async function loadMyOrders(userId) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/orders?userId=${userId}`);
      if (!res.ok) throw new Error("Could not found order");

      const data = await res.json();

      dispatch({ type: "orders/loaded", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
  }

  // load order for guest users
  async function loadGuestOrders(phoneNumber) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(
        `${BASE_URL}/orders?userId=Guest&phone=${phoneNumber}`
      );

      if (!res.ok) throw new Error("Could not load order");

      const data = await res.json();

      dispatch({ type: "orders/loaded", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
  }

  async function addOrder(order) {
    dispatch({ type: "loading" });

    let data;
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        throw new Error("Faild to add order!");
      }
      data = await res.json();

      dispatch({ type: "order/added", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
    return data;
  }

  async function deleteOrder(id) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/orders/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete the order");
      }

      dispatch({ type: "order/deleted", payload: id });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
  }

  async function editOrder(order) {
    dispatch({ type: "loading" });
    let data;
    try {
      // the put method replace the existing order what the new one that is just sending
      const res = await fetch(`${BASE_URL}/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error("Could not edit the order");

      data = await res.json();

      dispatch({ type: "order/edited", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
    return data;
  }

  async function updateOrderPayment(orderId, paidIncrement) {
    dispatch({ type: "loading" });
    try {
      const orderRes = await fetch(`${BASE_URL}/orders/${orderId}`);

      if (!orderRes.ok) throw new Error(`Couldn't found order ${orderId}`);

      const order = await orderRes.json();

      const newPaidAmount = Math.max(order.paidAmount + paidIncrement, 0);
      const newRemining = Math.max(order.total - newPaidAmount, 0);
      // Here if newPaidAmount is greater than order total then the result would be negative
      // which is meaning less because paidAmount can't be greater than total, so here for that
      // scenario it sets the newRemaining to 0,

      const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paidAmount: newPaidAmount,
          remain: newRemining,
        }),
      });
      if (!res.ok) throw new Error(`Couldn't update the ${orderId} payment`);
      const updatedOrder = await res.json();

      dispatch({ type: "orderPayment/updated", payload: updatedOrder });
      return updatedOrder;
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        error,
        isLoading,
        loadMyOrders,
        loadGuestOrders,
        addOrder,
        deleteOrder,
        editOrder,
        searchQuery,
        setSearchQuery,
        filterOption,
        setFilterOption,
        filter,
        setFilter,
        updateOrderPayment,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined)
    throw new Error("Orders context is used out of it is provider");
  return context;
}

export { OrderProvider, useOrders };
