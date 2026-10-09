import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./SignUp.module.css";
import { useUser } from "../Contexts/UsersContext";
import Message from "../components/Message";

function SignUp({
  isMenuOpen,
  setIsMenuOpen,
  usedByAdmin = false,
  className = "",
  formClass = "",
  btnClass = "",
  userToEdit = null,
  setShowForm,
}) {
  const { createUser, users, editUser } = useUser();

  const navigate = useNavigate();
  const [name, setName] = useState(userToEdit?.name ?? "");
  const [email, setEmail] = useState(userToEdit?.email ?? "");
  const [password, setPassword] = useState(userToEdit?.password ?? "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(userToEdit?.role ?? "user");
  const [error, setError] = useState({});

  let userCreationError;

  async function handleSubmit(e) {
    e.preventDefault();
    const newError = {};

    const nameRegExp = /^[a-zA-Z\s]+$/;

    if (users.find((u) => u.name === name)) {
      newError.name = "name already exist please use a unique name";
    }

    if (!name.trim()) {
      newError.name = "Name is required!";
    } else if (!nameRegExp.test(name)) {
      newError.name = "Name can only contain letters!";
    }

    // ali@gmail.com , ali123@gmail.com , ali_amini@hotmail.com, @yahoo.com ,

    const emailRegExp = new RegExp(
      "^[a-z]{2,10}_?[a-z0-9]{1,7}@[a-zA-Z]{4,7}.[a-z]{2,7}$"
    );

    /*
    without ^ and $ the regexp would match a sub string 
    for example my name is ali@gmail.com it will be true
    123ali@gmail.com456 wll be true, because it find the pattern 
    inside the string and threats the pattern as sub string, 

    but with anchor ^ $ the above would be false, because now the regExp 
    will search the entire string not a substring
    */

    if (!email.trim()) {
      newError.email = "Email is required!";
    } else if (!emailRegExp.test(email)) {
      newError.email =
        "Email should have the correct format as example@example.example";
    }

    const passwordRegExp = new RegExp(
      "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$!]).{8,}$"
    );

    if (!password.trim()) {
      newError.password = "Password is required";
    } else if (!passwordRegExp.test(password)) {
      newError.password = `Password must contain at least one upper case letter one digit and one symbol and at
      least 8 characters long`;
    }

    if (password !== confirmPassword) {
      newError.confirmPassword = "Passwords does not match";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    if (userToEdit) {
      try {
        await editUser({ id: userToEdit.id, name, email, password, role });
        navigate("../../admin/users", {
          state: {
            msg: "User data is updated  successfully ",
            showMsg: true,
          },
        });

        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
        setConfirmPassword("");
        setShowForm(false);
      } catch (e) {
        navigate(location.pathname, {
          state: { msg: e.message, showMsg: true },
        });
      }
    } else {
      try {
        let newUser;

        if (usedByAdmin) newUser = { name, email, password, role };
        else newUser = { name, email, password, role: "user" };

        await createUser(newUser);
        if (usedByAdmin) {
          navigate("../../admin/users", {
            state: {
              msg: "User is created successfully ",
              showMsg: true,
            },
          });

          setName("");
          setEmail("");
          setPassword("");
          setRole("user");
          setConfirmPassword("");
          setShowForm(false);
        } else {
          navigate("../signin", {
            state: {
              msg: "Your account has been successfully created",
              showMsg: true,
            },
          });
        }
      } catch (e) {
        userCreationError = e.message;
        navigate(location.pathname, {
          state: { msg: e.message, showMsg: true },
        });
      }
    }
  }

  return (
    <main className={`${styles.signupContainer} ${className}`}>
      {!usedByAdmin && (
        <PageNav
          classname={styles.nav}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}
      <form
        className={`${styles.formSignup} ${formClass}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.col}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="enter your name"
          />
          <p className={styles.error}>{error.name}</p>
        </div>

        <div className={styles.col}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="enter your email address"
          />
          <p className={styles.error}>{error.email}</p>
        </div>

        {usedByAdmin && (
          <div className={styles.col}>
            <label>Role</label>
            <div className={styles.roleContainer}>
              <label className={styles.labelRole}>
                <span>User</span>
                &nbsp;&nbsp;
                <input
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  type="radio"
                  value="user"
                />
              </label>
              <label className={styles.labelRole}>
                <span>Admin</span>
                <input
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                  type="radio"
                  value="admin"
                />
              </label>
            </div>
          </div>
        )}

        <div className={styles.col}>
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="enter your password"
          />
          <p className={styles.error}>{error.password}</p>
        </div>
        <div className={styles.col}>
          <label>Confirm password</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="confirm your password"
          />
          <p className={styles.error}>{error.confirmPassword}</p>
        </div>

        <button className={`${styles.signupBtn} ${btnClass}`}>
          {" "}
          {usedByAdmin ? "Done" : "Signup"}
        </button>
      </form>
      <Message message={userCreationError} />
    </main>
  );
}

export default SignUp;
