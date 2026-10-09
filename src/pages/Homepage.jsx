import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";
import PageNav from "../components/PageNav";

import Products from "../components/Products";
import Search from "../components/Search";
import Filter from "../components/Filter";
import { useState } from "react";
import Footer from "../components/Footer";
import { useCart } from "../Contexts/CartContext";

export default function Homepage({ isMenuOpen, setIsMenuOpen }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showCategory, setShowCategory] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const { cart } = useCart();

  const numCartItems = cart?.length;

  function handleShopNow(e) {
    e.preventDefault();
    const productSection = document.getElementById("products");
    productSection.scrollIntoView({ behavior: "smooth" });
  }

  function onSelectCategory(category) {
    setSelectedCategory(category);
    const productSection = document.getElementById("products");
    productSection.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <main className={styles.homepage}>
        <PageNav
          numCartItems={numCartItems}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        <div className={styles.content}>
          <Filter
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            showCategory={showCategory}
          />

          <button
            className={styles.toggleBtn}
            onClick={() => setShowCategory((show) => !show)}
          >
            {showCategory ? "Close" : "Categories"}
          </button>

          <div className={styles.rightSide}>
            <Search
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search for the products here..."
            />

            <section>
              <h2>Best Prices on daily essentials</h2>
              <Link
                onClick={(e) => handleShopNow(e)}
                className={`${!isMenuOpen ? "cta" : styles.shopNowBtn} ${
                  styles.responsiveBtn
                }`}
              >
                Shop Now
              </Link>
            </section>
          </div>
        </div>
      </main>

      <Products
        id="products"
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      <Footer />
    </>
  );
}
