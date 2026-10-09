import { useEffect } from "react";
import { useContext } from "react";
import { createContext, useReducer } from "react";

const BASE_URL = "http://localhost:9000";

const UserContext = createContext();

const initialState = {
  users: [],
  userLoading: false,
  userError: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "userLoading":
      return {
        ...state,
        userLoading: true,
      };

    case "users/loaded":
      return {
        ...state,
        users: [...action.payload],
        userLoading: false,
      };
    case "user/created":
      return {
        ...state,
        users: [...state.users, action.payload],
        userLoading: false,
      };

    case "user/deleted":
      return {
        ...state,
        userLoading: false,
        users: state.users.filter((user) => user.id !== action.payload),
      };

    case "user/updated":
      return {
        ...state,
        userLoading: false,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case "error":
      return {
        ...state,
        userLoading: false,
        userError: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
}

function UserProvider({ children }) {
  const [{ users, userLoading, userError }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function loadUsers() {
      dispatch({ type: "userLoading" });

      try {
        const res = await fetch(`${BASE_URL}/users`);
        if (!res.ok) throw new Error("Couldn't load users");

        const data = await res.json();

        dispatch({ type: "users/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "error", payload: e.mssage });
      }
    }
    loadUsers();
  }, []);

  async function createUser(user) {
    let data;
    dispatch({ type: "userLoading" });

    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        throw new Error(`Can't create a new user please try again later`);
      }
      data = await res.json();

      dispatch({ type: "user/created", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }

    return data;
  }

  async function deleteUser(id) {
    dispatch({ type: "userLoading" });

    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Couldn't delete user");

      dispatch({ type: "user/deleted", payload: id });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
  }

  async function editUser(user) {
    dispatch({ type: "userLoading" });

    try {
      const res = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Couldn't edit user");

      const data = await res.json();

      dispatch({ type: "user/updated", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
  }

  return (
    <UserContext.Provider
      value={{
        users,
        userLoading,
        userError,
        createUser,
        deleteUser,
        editUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);

  if (context === undefined)
    throw new Error(`User Context is used out of it is provider`);

  return context;
}

export { UserProvider, useUser };
