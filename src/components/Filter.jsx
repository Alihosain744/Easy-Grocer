import { useCategories } from "../Contexts/ProductsContext";
import styles from "./Filter.module.css";
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

function Filter({
  showCategory,
  selectedCategory,
  onSelectCategory,
  className = "",
}) {
  // Beverage, washer including of shampoo, dishwashing liquid, stain remover , wahsing powder, toilet liquid, confictionary subtype including of chocolate, Biscuits,cake ,Hygiene subtype Hair color,diaper,toilet paper ,
  // coffee, green tea, black tea, noodles, spaghatti, office supplies, potato chips, snacks and crackers,
  // sugar, ciggarettes, rice corn, corn flour, milk, cream, cheese, clothes soup,tailoring thread, steal wool scurbber (سیم ظرفا), socks,tomato paste, tooth brush, tooth paste,
  // disposable shaver(ماشین ریش یک بار مصرف), razor  (ماشین ریش),

  const { categories } = useCategories();

  return (
    <ul
      className={`${styles.filterContainer} ${className} ${
        showCategory ? styles.open : ""
      }`}
    >
      <li
        className={`${styles.category} ${
          !selectedCategory ? styles.active : ""
        }`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </li>
      {categories.map((category) => (
        <li
          onClick={() => onSelectCategory(category.name)}
          key={category.id}
          className={`${styles.category} ${
            selectedCategory === category.name ? styles.active : ""
          }`}
        >
          {category.name}
        </li>
      ))}
    </ul>
  );
}

export default Filter;
