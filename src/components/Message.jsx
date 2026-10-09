import styles from "./Message.module.css";

function Message({ message, className = "" }) {
  return (
    <p className={`${styles.message} ${className}`}>
      <span role="img"></span> {message}
    </p>
  );
}

export default Message;
