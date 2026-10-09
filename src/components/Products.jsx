import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import ProductItems from "./ProductItems";
import styles from "./Products.module.css";
import { useEffect } from "react";
import { useProducts } from "../Contexts/ProductsContext";
import Spinner from "./Spinner";
import Message from "./Message";

// const products = [
//   {
//     name: "Ginseng Energy Drink",
//     price: 80,
//     description: `High energy beverage, use it during tiredness, use before meal, do not
//     use fake, it will spoil your taste`,
//     img: "/ginseng.jpeg",
//   },
//   {
//     name: "X bull Energy Drink",
//     price: 30,
//     description: `High energy beverage, use it during tiredness, use before meal, do not
//     use fake, it will spoil your taste`,
//     img: "/ginseng.jpeg",
//   },
//   {
//     name: "Xbull Energy Drink",
//     price: 30,
//     description: `High energy beverage, use it during tiredness, use before meal, do not
//     use fake, it will spoil your taste`,
//     img: "/ginseng.jpeg",
//   },
//   {
//     name: "Xbull Energy Drink",
//     price: 30,
//     description: `High energy beverage, use it during tiredness, use before meal, do not
//     use fake, it will spoil your taste`,
//     img: "/xbull.jpeg",
//   },
//   {
//     name: "Xbull Energy Drink",
//     price: 30,
//     description: `High energy beverage, use it during tiredness, use before meal, do not
//     use fake, it will spoil your taste`,
//     img: "/xbull.jpeg",
//   },
// ];

const VISIBLE_COUNT = 5;

function Products({
  id = "",
  addProductBtn = false,
  action = false,
  selectedCategory = null,
  searchQuery = "",
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const { products, isProductLoading, deleteProduct } = useProducts();

  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [showMessage, setShowMessage] = useState(
    location.state?.showMsg ?? false
  );
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productError, setProductError] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);

  const filteredProducts = products
    .filter(
      (p) =>
        !selectedCategory ||
        p.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    .filter((p) =>
      p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

  const visible_products = isExpanded
    ? filteredProducts
    : filteredProducts.slice(0, VISIBLE_COUNT);

  const hasMore = filteredProducts.length > VISIBLE_COUNT;

  function handleEscape(e) {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  }

  useEffect(
    function () {
      document.addEventListener("keydown", handleEscape);

      return () => document.removeEventListener("keydown", handleEscape);
    },
    [setIsModalOpen]
  );

  useEffect(
    function () {
      if (location.state?.showMsg) {
        setShowMessage(true);
      }
    },
    [location.state]
  );

  useEffect(
    function () {
      if (!productError) return;
      const timer = setTimeout(function () {
        setProductError("");
      }, 2000);

      return () => clearTimeout(timer);
    },
    [productError]
  );

  useEffect(
    function () {
      if (!showMessage) return;
      const timer = setTimeout(function () {
        setShowMessage(false);
        navigate(location.pathname, { state: { msg: null, showMsg: false } });
      }, 2000);

      return () => clearTimeout(timer);
    },
    [showMessage]
  );

  async function onConfirm() {
    try {
      await deleteProduct(currentProduct.id);
    } catch (e) {
      setProductError(e.message);
    }
  }

  return (
    <>
      <Modal
        currentProduct={currentProduct}
        onConfirm={onConfirm}
        mode={modalMode}
        IsModalOpen={IsModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {showMessage && (
        <Message className={styles.productMsg} message={location.state?.msg} />
      )}
      {productError && (
        <Message className={styles.delete} message={productError} />
      )}
      <h1 className={styles.productHeading}>Products</h1>
      {addProductBtn && (
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalMode("add");
          }}
          className={styles.addProductBtn}
        >
          Add Product
        </button>
      )}
      {isProductLoading ? (
        <Spinner />
      ) : (
        <ul id={id} className={styles.productContainer}>
          {visible_products.length === 0 && (
            <Message
              className={styles.msg}
              message="There are no such product exist"
            />
          )}
          {visible_products.map((product, i) => (
            <ProductItems
              IsModalOpen={IsModalOpen}
              setIsModalOpen={setIsModalOpen}
              setModalMode={setModalMode}
              action={action}
              product={product}
              setCurrentProduct={setCurrentProduct}
              key={product.id ?? i}
            />
          ))}
        </ul>
      )}
      {hasMore && (
        <button
          className={styles.expand_btn}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
}

export default Products;
