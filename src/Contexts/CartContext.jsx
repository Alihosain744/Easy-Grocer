import { useEffect, useContext, useReducer, createContext } from "react";
import { useAuth } from "./AuthContext";

const BASE_URL = "http://localhost:9000/cart";

const CartContext = createContext();

const initialState = {
  cartLoading: false,
  cart: [],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        cartLoading: true,
      };

    // here and in the guestCart/loaded action type, action.payload which is enriched
    // cartitem with their related product infos and are stored in the cart state.
    case "cart/loaded":
      return {
        ...state,
        cartLoading: false,
        cart: action.payload,
      };
    case "guestCart/loaded":
      return {
        ...state,
        cartLoading: false,
        cart: action.payload,
      };
    case "item/added":
      return {
        ...state,
        cartLoading: false,
        cart: [...state.cart, action.payload],
      };
    case "quantityincreased/existingItem":
      return {
        ...state,
        cartLoading: false,
        cart: state.cart.map((cartItem) =>
          cartItem.id === action.payload.id ? action.payload : cartItem
        ),
      };

    case "itemadded/localstorage":
      return {
        ...state,
        cartLoading: false,
        cart: [...state.cart, action.payload],
      };

    case "quantity/increased":
      return {
        ...state,
        cart: state.cart.map((cartItem) =>
          cartItem.id === action.payload.id ? action.payload : cartItem
        ),
      };

    case "quantityIncreased/localStorage":
      console.log("state cart", state.cart);
      return {
        ...state,
        cart: state.cart.map((cartItem) =>
          cartItem.productId === action.payload.productId
            ? action.payload
            : cartItem
        ),
      };
    case "quantity/decreased":
      return {
        ...state,
        cart: state.cart.map((cartItem) =>
          cartItem.id === action.payload.id ? action.payload : cartItem
        ),
      };

    case "quantityDecreased/localStorage":
      return {
        ...state,
        cart: state.cart.map((cartItem) =>
          cartItem.productId === action.payload.productId
            ? action.payload
            : cartItem
        ),
      };

    case "items/deleted":
      return {
        ...state,
        cartLoading: false,
        cart: state.cart.filter(
          (cartItem) => !action.payload.includes(cartItem.id)
        ),
      };

    case "itemDeleted/localstorage":
      return {
        ...state,
        cartLoading: false,
        cart: state.cart.filter(
          (cartItem) => cartItem.productId !== action.payload
        ),
      };

    case "cart/cleared":
      return {
        ...state,
        cartLoading: false,
        cart: [],
      };

    case "error":
      return {
        ...state,
        cartLoading: false,
        error: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
}

function CartProvider({ children }) {
  const { currentUser } = useAuth();

  const [{ cartLoading, cart, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(
    function () {
      async function loadCart() {
        dispatch({ type: "loading" });
        let cartData;

        try {
          if (currentUser) {
            // if there is any actual user at the backend and is logged in
            // then fetch the cart data for that related user
            const res = await fetch(`${BASE_URL}?userId=${currentUser.id}`);

            if (!res.ok) throw new Error("Couldn't load cart");

            cartData = await res.json();

            // enrich each cart row with live product data
            const enriched = await Promise.all(
              cartData?.map(async (item) => {
                const prodRes = await fetch(
                  `http://localhost:9000/products/${item.productId}`
                );
                const product = await prodRes.json();
                return { ...item, product }; // {id,userId,productId,quantity,product:{...}}
              })
            );

            dispatch({ type: "cart/loaded", payload: enriched });

            // enrich the cart with it is related products info
          } else {
            //otherwise read the cart data from localStorage
            const guestCart = JSON.parse(
              localStorage.getItem("guestCart") ?? "[]"
            );

            const enriched = await Promise.all(
              guestCart?.map(async (item) => {
                const prodRes = await fetch(
                  `http://localhost:9000/products/${item.productId}`
                );
                const product = await prodRes.json();
                return { ...item, product }; // {id,userId,productId,quantity,product:{...}}
              })
            );

            dispatch({ type: "guestCart/loaded", payload: enriched });
            cartData = guestCart;
          }
        } catch (e) {
          dispatch({ type: "error", payload: e.message });
          throw e;
        }
        return cartData;
      }
      loadCart();
    },
    [currentUser]
  );

  async function addToCart(item) {
    dispatch({ type: "loading" });

    let insertedCartItem;
    try {
      if (currentUser) {
        const existingItem = cart.find((i) => i.id === item.id);

        if (existingItem) {
          // Item exists — just increase quantity via PATCH, then replace in state
          const newQuantity = existingItem.quantity + 1;

          const res = await fetch(`${BASE_URL}/${existingItem.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQuantity }),
          });
          if (!res.ok) throw new Error("Trouble while updating cart item");

          const updatedCartItem = await res.json();

          dispatch({
            type: "quantityincreased/existingItem",
            payload: { ...updatedCartItem, product: existingItem.product },
          });
        } else {
          // New item — insert into backend
          const res = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.id,
              productId: item.id,
              quantity: 1,
            }),
          });
          if (!res.ok) throw new Error("Trouble while adding item to cart");

          insertedCartItem = await res.json();

          const prodRes = await fetch(
            `http://localhost:9000/products/${item.id}`
          );
          const product = await prodRes.json();

          dispatch({
            type: "item/added",
            payload: { ...insertedCartItem, product },
          });
        }
      } else {
        const existingCart = JSON.parse(
          localStorage.getItem("guestCart") || "[]"
        );
        const existingItem = existingCart.find((i) => i.productId === item.id);

        if (existingItem) {
          // Item exists — increment quantity, replace in place
          const updatedCartItem = {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          };

          const updatedCart = existingCart.map((i) =>
            i.productId === item.id ? updatedCartItem : i
          );

          localStorage.setItem("guestCart", JSON.stringify(updatedCart));

          dispatch({
            type: "quantityIncreased/localStorage",
            payload: { ...updatedCartItem, product: existingItem.product },
          });
        } else {
          // New guest item — fetch product info, append
          const prodRes = await fetch(
            `http://localhost:9000/products/${item.id}`
          );
          const product = await prodRes.json();

          const newItem = { productId: item.id, quantity: 1 };
          const updatedCart = [...existingCart, newItem];

          localStorage.setItem("guestCart", JSON.stringify(updatedCart));

          dispatch({
            type: "itemadded/localstorage",
            payload: { ...newItem, product },
          });
        }
      }
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
    return insertedCartItem;
  }

  async function increaseQuantity(cartItemId) {
    if (currentUser) {
      const item = cart.find((cartItem) => cartItem.id === cartItemId);

      const newQuantity = item.quantity + 1;

      const res = await fetch(`${BASE_URL}/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const updatedCart = await res.json();

      const prodRes = await fetch(
        `http://localhost:9000/products/${item.productId}`
      );
      const product = await prodRes.json();
      // encrich the updated cart item with it is related product info for using further at UI
      dispatch({
        type: "quantity/increased",
        payload: { ...updatedCart, product },
      });
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

      const item = guestCart.find((gc) => gc.productId === cartItemId);
      const newQuantity = item.quantity + 1;

      const updatedCartItem = { ...item, quantity: newQuantity };

      const prodRes = await fetch(
        `http://localhost:9000/products/${item.productId}`
      );
      const product = await prodRes.json();

      // just update the quantity for choosen cart Item and remain intact other cartitems at the localstorage
      const updateGuestCart = guestCart.map((gc) =>
        gc.productId === cartItemId ? updatedCartItem : gc
      );

      // just set the new updated cart item to the localStorage without any enrichment
      localStorage.setItem("guestCart", JSON.stringify(updateGuestCart));

      dispatch({
        type: "quantityIncreased/localStorage",
        payload: { ...updatedCartItem, product },
      });
    }
  }

  async function decreaseQuantity(cartItemId) {
    if (currentUser) {
      const item = cart.find((cartItem) => cartItem.id === cartItemId);

      if (item.quantity <= 1) return;

      const newQuantity = item.quantity - 1;
      const res = await fetch(`${BASE_URL}/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const updatedCart = await res.json();

      const prodRes = await fetch(
        `http://localhost:9000/products/${item.productId}`
      );

      const product = await prodRes.json();

      dispatch({
        type: "quantity/decreased",
        payload: { ...updatedCart, product },
      });
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const itemToUpdateQuantity = guestCart.find(
        (gc) => gc.productId === cartItemId
      );
      if (itemToUpdateQuantity.quantity <= 1) return;

      const newQuantity = itemToUpdateQuantity.quantity - 1;

      const updatedItem = { ...itemToUpdateQuantity, quantity: newQuantity };

      const prodRes = await fetch(
        `http://localhost:9000/products/${itemToUpdateQuantity.productId}`
      );
      const product = await prodRes.json();

      const updatedGuestCart = guestCart.map((gc) =>
        gc.productId === cartItemId ? updatedItem : gc
      );

      localStorage.setItem("guestCart", JSON.stringify(updatedGuestCart));

      dispatch({
        type: "quantityDecreased/localStorage",
        payload: { ...updatedItem, product },
      });
    }
  }

  async function clearCartItem(idsOrProductId) {
    dispatch({ type: "loading" });
    if (currentUser) {
      try {
        await Promise.all(
          idsOrProductId.map(async (id) => {
            const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Couldn't delete the item");
          })
        );

        dispatch({ type: "items/deleted", payload: idsOrProductId });
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart" || "[]"));

      const updatedGuestCart = guestCart.filter(
        (gc) => gc.productId !== idsOrProductId
      );

      localStorage.setItem("guestCart", JSON.stringify(updatedGuestCart));

      dispatch({ type: "itemDeleted/localstorage", payload: idsOrProductId });
    }
  }

  async function clearCart() {
    dispatch({ type: "loading" });

    if (currentUser) {
      try {
        // cart is loaded already for the currently logged in user
        Promise.all(
          cart.map(async (item) => {
            const res = await fetch(`${BASE_URL}/${item.id}`, {
              method: "DELETE",
            });
            if (!res.ok) throw new Error("Couldn't clear the cart");
          })
        );

        dispatch({ type: "cart/cleared" });
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
      }
    } else {
      const ls = [];
      localStorage.setItem("guestCart", JSON.stringify(ls));
      dispatch({ type: "cart/cleared" });
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartLoading,
        addToCart,
        cart,
        increaseQuantity,
        decreaseQuantity,
        clearCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("Cart Context is used out of it is provider");
  }

  return context;
}

export { CartProvider, useCart };
