import styles from "./MenuBtn.module.css";

function MenuBtn({ onclick }) {
  return (
    <div className={`${styles.menuBtn} `} onClick={onclick}>
      <svg
        id="menu-icon"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        stroke="white"
        viewBox="0 0 24 24"
      >
        <path d="M4 6h16M4 12h16M4 16h16"></path>
      </svg>
    </div>
  );
}

export default MenuBtn;
