import { useState } from "react";
import styles from "./Modal.module.css";
import { useCategories, useProducts } from "../Contexts/ProductsContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// const categories = [
//   "Beverage",
//   "Washer",
//   "Biscuits",
//   "Hygiene",
//   "Tea & Coffee",
//   "Pasts & Noodles",
//   "Office supplies",
//   "Snacks and crackers",
//   "Confictionary",
//   "Ciggarettes",
//   "Cooking ingredients",
//   "Diary products",

//   "Clothes soup",
//   "Household essentials",
//   "Personal care",
//   "Clothing basics",
// ];

const ALLOWED_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
const MAX_SIZE = 1;

function Modal({
  mode,
  IsModalOpen,
  setIsModalOpen,
  onConfirm = () => {},
  setCategoryToDelete = () => {},
  currentProduct = {},
  favDeleteMsg = "",
}) {
  const { addProduct, editProduct } = useProducts();
  const { categories } = useCategories();

  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = mode === "edit";

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]?.name ?? "");

  const selectedCategory = category || categories[0]?.name || "";

  const [stock, setStock] = useState("");
  const [imageBase64, setImageBase64] = useState(null);

  const [description, setDescription] = useState("");

  const [error, setError] = useState({});

  let newError = {};

  useEffect(
    function () {
      if (isEditing) {
        setName(currentProduct?.name);
        setPrice(currentProduct?.price);
        setStock(currentProduct?.stock);
        setCategory(currentProduct?.category);
        setImageBase64(currentProduct?.image);
        setDescription(currentProduct?.description);
      } else {
        setName("");
        setPrice("");
        setStock("");
        setCategory("");
        setImageBase64(null);
        setDescription("");
      }
    },
    [currentProduct, isEditing]
  );

  function handleFileChange(e) {
    const file = e.target.files[0];
    const maxBytes = MAX_SIZE * 1024 * 1024;

    if (file.size > maxBytes) {
      setError((prev) => ({
        ...prev,
        image: "Maximum 1MB image file is supported",
      }));
      setImageBase64(null);
      e.target.value = "";
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError((prev) => ({
        ...prev,
        image: "only jpg, jpeg , png and gif files are allowed",
      }));
      setImageBase64(null);
      e.target.value = "";
      return;
    }

    // clear the error for valid iamge file
    setError((prev) => ({ ...prev, image: "" }));

    const reader = new FileReader();
    // 1)  the FIleReader is an Object that reads the file from users computer
    // the above code is just like an empty tape recorder

    reader.onloadend = async () => {
      setImageBase64(reader.result);
      // then store the output from step 2 here in reader.result
    };

    reader.readAsDataURL(file);
    // 2) here it convert the red file into base64 string
  }

  function handleCloseModal() {
    setIsModalOpen(false);

    setCategoryToDelete(null);
  }

  async function handleAddProduct() {
    const nameRegExp = /^[a-zA-Z\s]+[0-9]*$/;

    if (!name.trim()) {
      newError.name = "Name is required";
    } else if (!nameRegExp.test(name)) {
      newError.name = "Name can only contain letters and digits";
    }

    const priceRegExp = /^\d+$/;
    if (!price.toString().trim()) {
      newError.price = "Price is required";
    } else if (!priceRegExp.test(price)) {
      newError.price = "Price can only contain digits";
    } else if (price <= 0) {
      newError.price = "Price can only be positve number";
    }

    const descRegExp = /^[a-zA-Z0-9\s,.]+$/;

    if (!descRegExp.test(description)) {
      newError.description =
        "Description can only contain letters, space and digits and new line";
    }

    const categoryRegExp = /^[a-zA-Z\s]+\s?[&]?\s?[0-9]*[a-z]*$/;

    if (!selectedCategory.trim()) {
      newError.category = "Category is required";
    } else if (!categoryRegExp.test(selectedCategory)) {
      newError.category =
        "Category can only contain letters, space and digits ";
    }

    const stockRegExp = /^[0-9]+$/;

    if (!stock.toString().trim()) {
      newError.stock = "stock is required";
    } else if (!stockRegExp.test(stock)) {
      newError.stock = "Stock can only contain numbers";
    }
    if (stock <= 0) {
      newError.stock = "Stock can only be a positive number";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    if (isEditing) {
      try {
        await editProduct({
          id: currentProduct?.id,
          name,
          price,
          category: selectedCategory,
          stock,
          image: imageBase64,
          description,
        });
        setIsModalOpen(false);
        navigate(location.pathname, {
          state: {
            msg: "Product has been updated successfully",
            showMsg: true,
          },
        });
      } catch {
        setIsModalOpen(false);
        navigate(location.pathname, {
          state: { msg: "Trouble while updating product", showMsg: true },
        });
      }
      return;
    }

    try {
      const newProduct = {
        name,
        price,
        description,
        image: imageBase64,
        category,
        stock,
      };
      await addProduct(newProduct);
      setIsModalOpen(false);
      setError({});
      navigate(location.pathname, {
        state: { msg: "Product has been added successfully", showMsg: true },
      });

      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImageBase64(null);
      setStock("");
    } catch {
      navigate(location.pathname, {
        state: { msg: "Trouble while adding product", showMsg: true },
      });
    }
  }

  function handlebtnDone() {
    if (mode === "delete") {
      onConfirm();
      setIsModalOpen(false);
    } else {
      handleAddProduct();
    }
  }

  return (
    <div className={styles.modalWrapper}>
      {IsModalOpen && <div className={`${styles.modalOverlay}`}></div>}

      {IsModalOpen && (
        <div className={`${styles.modalContainer}`}>
          <button onClick={handleCloseModal} className={styles.closeModalBtn}>
            &times;
          </button>

          <div className={styles.modalContent}>
            <h2 className={styles.modalHeading}>
              {mode === "edit" && "Edit Product"}
              {mode === "add" && "Add Product"}

              {mode === "delete" &&
                favDeleteMsg &&
                `Are you sure you want to delete this record ${favDeleteMsg}`}
              {mode === "delete" &&
                !favDeleteMsg &&
                "Are you sure you want to delete this record?"}
            </h2>
            {mode !== "delete" && (
              <form className={styles.modalForm}>
                <div className={styles.col}>
                  <label>Product</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder={
                      mode === "add" ? "Enter the name of the product" : ""
                    }
                  />
                  <p className={styles.error}>{error.name}</p>
                </div>
                <div className={styles.col}>
                  <label>Price</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    type="number"
                    placeholder={
                      mode === "add" ? "Enter the price of the product" : ""
                    }
                  />
                  <p className={styles.error}>{error.price}</p>
                </div>

                <div className={styles.col}>
                  <label>Category</label>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat, i) => (
                      <option value={cat.name} key={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className={styles.error}>{error.category}</p>
                </div>

                <div className={styles.col}>
                  <label>Stock</label>
                  <input
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    type="number"
                    placeholder={
                      mode === "add"
                        ? "Enter amount of product available in your stock"
                        : ""
                    }
                  />
                  <p className={styles.error}>{error.stock}</p>
                </div>

                <div className={styles.col}>
                  <label>Image</label>

                  <input onChange={handleFileChange} type="file" />
                  {isEditing && (
                    <input
                      className={styles.editImage_product}
                      type="image"
                      src={currentProduct?.image}
                    />
                  )}
                  <p className={styles.error}>{error.image}</p>
                </div>

                <div className={styles.col}>
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      mode === "add"
                        ? "Write some description regarding the product"
                        : ""
                    }
                  ></textarea>
                  <p className={styles.error}>{error.description}</p>
                </div>
              </form>
            )}
          </div>
          <div className={styles.modalBtnsWrapper}>
            <button
              onClick={handlebtnDone}
              className={`${styles.action} ${styles.btnDone}`}
            >
              Done
            </button>
            <button
              onClick={handleCloseModal}
              className={`${styles.action} ${styles.btnCancel}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
