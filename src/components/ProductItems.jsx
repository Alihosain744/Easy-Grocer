import { useAuth } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import { useCategories } from "../Contexts/ProductsContext";

import styles from "./ProductItems.module.css";

function ProductItems({
  product,
  action,
  IsModalOpen,
  setIsModalOpen,
  setModalMode,
  setCurrentProduct,
}) {
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  // here if some couldn't find a match then it returns false
  const categoryExists = categories.some(
    (cat) =>
      cat.name.trim().toLowerCase() === product.category?.trim().toLowerCase()
  );
  function handleDeleteProduct() {
    setIsModalOpen(true);
    setModalMode("delete");
    setCurrentProduct(product);
  }
  function handleEditProduct() {
    setIsModalOpen(true);
    setModalMode("edit");
    setCurrentProduct(product);
  }

  async function handle_add_to_cart() {
    try {
      await addToCart(product);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <li className={styles.cartContainer}>
      <img
        className={styles.cartImg}
        alt={product.name}
        src={`${product.image}`}
      />

      <span className={styles.details}>
        <span className={styles.productName}>{product.name}</span>
        <p className={styles.productDescription}> {product.description} </p>

        <span className={styles.productPrice}>{product.price} Afs</span>
        <div className={styles.meta}>
          <span className={styles.category}>
            Category: {categoryExists ? product.category : "deleted"}
          </span>

          <span className={styles.stock}>Stock: {product.stock}</span>
        </div>
        {!action && !isAdmin && (
          <button onClick={handle_add_to_cart} className={styles.addToCart}>
            +
          </button>
        )}
        {action && (
          <button onClick={handleEditProduct} className={styles.editProduct}>
            Edit
          </button>
        )}
        {action && (
          <button
            onClick={handleDeleteProduct}
            className={styles.deleteProduct}
          >
            Delete
          </button>
        )}
      </span>
    </li>
  );
}

export default ProductItems;
