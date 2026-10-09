// products + category filter

import { useEffect } from "react";
import { useContext } from "react";
import { useReducer } from "react";
import { createContext } from "react";

const ProductContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  products: [],
  isProductLoading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "product/loading":
      return {
        ...state,
        isProductLoading: true,
      };
    case "products/loaded":
      return {
        ...state,
        isProductLoading: false,
        products: action.payload,
      };
    case "products/added":
      return {
        ...state,
        isProductLoading: false,
        products: [...state.products, action.payload],
      };

    case "product/deleted":
      return {
        ...state,
        isProductLoading: false,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    case "product/edited":
      return {
        ...state,
        isProductLoading: false,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case "error":
      return {
        ...state,
        error: action.payload,
        isProductLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
}

function ProductProvider({ children }) {
  const [{ products, isProductLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function loadProducts() {
      dispatch({ type: "product/loading" });
      try {
        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) throw new Error("Couldn't load products");

        const data = await res.json();

        dispatch({ type: "products/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
      }
    }
    loadProducts();
  }, []);

  async function addProduct(product) {
    dispatch({ type: "product/loading" });
    let data;
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Couldn't add product");

      data = await res.json();

      dispatch({ type: "products/added", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
    return data;
  }

  async function deleteProduct(id) {
    dispatch({ type: "product/loading" });
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Couldn't delete the product!");

      dispatch({ type: "product/deleted", payload: id });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
  }

  async function editProduct(product) {
    dispatch({ type: "product/loading" });
    let data;
    try {
      const res = await fetch(`${BASE_URL}/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Couldn't edit the product");

      data = await res.json();
      dispatch({ type: "product/edited", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
    return data;
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        isProductLoading,
        error,
        addProduct,
        deleteProduct,
        editProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

function useProducts() {
  const context = useContext(ProductContext);

  if (context === undefined)
    throw new Error("Product context is used out of it provider ");
  return context;
}

const CategoriesContext = createContext();

const initialCategoriesState = {
  categories: [],
  isCategoryLoading: false,
  error: "",
};

function categoriesReducer(state, action) {
  switch (action.type) {
    case "categories/loading":
      return {
        ...state,
        isCategoryLoading: true,
      };

    case "categories/loaded":
      return {
        isCategoryLoading: false,
        categories: action.payload,
      };
    case "category/added":
      return {
        ...state,
        isCategoryLoading: false,
        categories: [...state.categories, action.payload],
      };
    case "category/deleted":
      return {
        ...state,
        isCategoryLoading: false,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };
    case "error":
      return {
        ...state,
        isCategoryLoading: false,
        error: action.payload,
      };
    case "category/edited":
      return {
        ...state,
        isCategoryLoading: false,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    default:
      return {
        ...state,
      };
  }
}

function CategoryProvider({ children }) {
  const [{ categories, isCategoryLoading, error }, dispatch] = useReducer(
    categoriesReducer,
    initialCategoriesState
  );

  useEffect(function () {
    async function loadCategories() {
      dispatch({ type: "categories/loading" });
      try {
        const res = await fetch(`${BASE_URL}/categories`);

        if (!res.ok) throw new Error("Couldn't load categories");

        const data = await res.json();

        dispatch({ type: "categories/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
        throw e;
      }
    }
    loadCategories();
  }, []);

  async function addCategory(category) {
    dispatch({ type: "categories/loading" });
    let data;
    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      if (!res.ok) throw new Error("Couldn't add new cetegory");

      data = await res.json();

      dispatch({ type: "category/added", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
    return data;
  }

  async function deleteCategory(id) {
    dispatch({ type: "categories/loading" });

    try {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Couldn't delete the  category");

      dispatch({ type: "category/deleted", payload: id });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
  }

  async function editCategory(category) {
    dispatch({ type: "categories/loading" });
    let data;
    try {
      const res = await fetch(`${BASE_URL}/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      if (!res.ok) throw new Error("Couldn't edit the category");
      data = await res.json();

      dispatch({ type: "category/edited", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      throw e;
    }
  }

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        isCategoryLoading,
        addCategory,
        deleteCategory,
        editCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

function useCategories() {
  const context = useContext(CategoriesContext);

  if (context === undefined)
    throw new Error("Categories context is used out of it is provider");
  return context;
}

export { ProductProvider, useProducts, CategoryProvider, useCategories };
