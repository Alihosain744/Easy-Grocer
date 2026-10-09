import styles from "./Search.module.css";

function Search({
  placeholder,
  marginTop = 0,
  className = "",
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div
      style={{ marginTop: `${marginTop}px` }}
      className={`${styles.searchInputContainer} ${className}`}
    >
      <input
        className={styles.searchInput}
        type="text"
        value={searchQuery}
        placeholder={placeholder}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default Search;
