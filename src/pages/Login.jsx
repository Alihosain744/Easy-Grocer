import { useLocation, useNavigate } from "react-router-dom";

import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Message from "../components/Message";
import { useAuth } from "../Contexts/AuthContext";

export default function Login({ isMenuOpen, setIsMenuOpen }) {
  const { login, currentUser, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const [showMessage, setShowMessage] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  useEffect(function () {
    const timer = setTimeout(function () {
      setShowMessage(false);
      navigate(location.pathname, { state: null, replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(
    function () {
      if (isAuthenticated && currentUser?.role !== "admin") {
        navigate("../customer", { replace: true });
      } else if (isAuthenticated && currentUser?.role === "admin") {
        navigate("../admin", { replace: true });
      }
    },
    [isAuthenticated, currentUser]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    const emailRegExp = new RegExp(
      "^[a-z]{2,10}_?[a-z0-9]{1,7}@[a-zA-Z]{4,7}.[a-z]{2,7}$"
    );

    // (?...) this part is called lookAhead, it checks whether something exist in a string regardless of
    // their position
    // (?= this is called positive lookAhead it checks whether something exist and return the cursor where it was before
    // ()()() each of these three conditions are executed independently, it means, a password can start
    // with symbols like !,@,#,$ or any character or uppercase or digiit and can contain any character including
    // of uppercase symbol and digit and could be 8 character long or more.
    const passwordRegExp = new RegExp(
      "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$!]).{8,}$"
    );

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegExp.test(email)) {
      newErrors.email =
        "Email should have the correct format as example@example.example";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegExp.test(password.trim())) {
      newErrors.password =
        "Password must contain at least on uppercase letter, one digit and one symbol and must be 8 characters long";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      await login(email, password);
      setShowMessage(false);
    } catch (e) {
      setShowMessage(true);
      setError((prev) => ({ ...prev, credentialError: e.message }));
    }
  }

  return (
    <>
      <PageNav
        classname={styles.nav}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <main className={styles.login}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <p className={styles.error}>{error.email}</p>
          </div>

          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              placeholder="enter your password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <p className={styles.error}>{error.password}</p>
          </div>

          <div>
            <Button type="primary" onclick={(e) => handleSubmit(e)}>
              Login
            </Button>
          </div>
        </form>
        {showMessage && (
          <Message message={error.credentialError} className={styles.msg} />
        )}
      </main>
    </>
  );
}
