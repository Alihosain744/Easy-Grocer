import { useCategories, useProducts } from "../Contexts/ProductsContext";
import Message from "./Message";
import Spinner from "./Spinner";

import styles from "./Categories.module.css";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "./Modal";

function Categories() {
  const {
    categories,
    isCategoryLoading,
    addCategory,
    deleteCategory,
    editCategory,
  } = useCategories();
  const { products } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [formMode, setFormMode] = useState("");
  const [category, setCategory] = useState("");

  const [error, setError] = useState({});
  const [msg, setMsg] = useState("");
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  function handle_add_category(e) {
    e.preventDefault();
    setShowForm((show) => !show);
    setFormMode("add");
    setCategory("");
    setError({});
  }

  useEffect(
    function () {
      const timer = setTimeout(function () {
        setMsg("");
      }, 2000);

      return () => clearTimeout(timer);
    },
    [msg]
  );

  useEffect(
    function () {
      if (!categoryToEdit) return;

      setCategory(categoryToEdit?.name);
    },
    [categoryToEdit]
  );

  async function handle_submit(e) {
    e.preventDefault();

    const newError = {};

    if (!category.trim()) {
      newError.category = "Category is required";
    }

    const catRegExp = /^[a-zA-Z\s]+[&]*$/;

    if (!catRegExp.test(category)) {
      newError.category = "Category can only contains letters, space and &";
    }

    if (Object.keys(newError).length > 0) {
      setError({ newError });
      return;
    }

    if (formMode === "edit") {
      try {
        await editCategory({ ...categoryToEdit, name: category });

        setShowForm(false);
        setMsg("category has been edited successfully");
      } catch (e) {
        setError({ catEditErr: e.message });
      }
    } else {
      try {
        await addCategory({ name: category });
        setShowForm(false);
        setMsg("The category has been added successfully");
      } catch (e) {
        setError({ catErr: e.message });
        setShowForm(false);
      }
    }
  }

  async function onConfirm() {
    try {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      setMsg("The category has been deleted successfully");
    } catch (e) {
      setError({ catDeleteErr: e.message });
    }
  }

  function handle_delete_category(category) {
    setError({});
    const num_categories_used_in_products = products.filter(
      (p) =>
        p.category.trim().toLowerCase() === category.name.trim().toLowerCase()
    ).length;

    setCategoryToDelete(category);

    if (num_categories_used_in_products >= 1) {
      setIsModalOpen(true);
      setDeleteMsg(
        `This category is used by ${num_categories_used_in_products} products`
      );
    } else {
      setIsModalOpen(true);
      setDeleteMsg("");
    }
  }

  async function handle_edit_category(category) {
    setCategoryToEdit(category);
    setFormMode("edit");
    setShowForm(true);
  }
  return (
    <>
      <Modal
        mode="delete"
        IsModalOpen={IsModalOpen}
        setIsModalOpen={setIsModalOpen}
        favDeleteMsg={deleteMsg}
        onConfirm={onConfirm}
        setCategoryToDelete={setCategoryToDelete}
      />
      <main className={styles.category_container}>
        <section className={styles.col_1}>
          <button
            onClick={handle_add_category}
            className={styles.add_category_btn}
          >
            {showForm ? "Close" : "Add Category"}
          </button>
          {isCategoryLoading && <Spinner />}
          {error?.catErr && <Message message={error?.catErr} />}

          {error?.catDeleteErr && <Message message={error?.catDeleteErr} />}
          {error?.catEditErr && <Message message={error?.catEditErr} />}
          {categories.length >= 1 && (
            <table className={styles.category_table}>
              <thead>
                <tr>
                  <th>Category id</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td className={styles.action}>
                      <button
                        onClick={() => handle_edit_category(cat)}
                        className={styles.action_btn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handle_delete_category(cat)}
                        className={styles.action_btn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isCategoryLoading && categories.length <= 0 && (
            <Message message="No categores still exist, click add category button to add one" />
          )}
        </section>
        <section className={styles.col_2}>
          {showForm && (
            <form onSubmit={handle_submit} className={styles.form_add_category}>
              <h1 className={styles.form_add_category_heading}>
                {formMode === "edit" && "Form Edit Category"}
                {formMode === "add" && "Form Add Category"}
              </h1>
              <section className={styles.col}>
                <label>Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  type="text"
                  className={styles.control_category}
                  placeholder="Enter the name of category"
                />
                <p className={styles.error}>{error.newError?.category}</p>
              </section>
              <section className={styles.col_second_form_add_category}>
                <button className={`${styles.add_category}`}>
                  {formMode === "edit" && "Edit"}
                  {formMode === "add" && "Add"}
                </button>
              </section>
            </form>
          )}
          {msg && <Message message={msg} className={styles.msg} />}
        </section>
      </main>
    </>
  );
}

export default Categories;
