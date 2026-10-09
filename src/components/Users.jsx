import { useUser } from "../Contexts/UsersContext";
import { useState, useEffect } from "react";
import styles from "./Users.module.css";
import SignUp from "../pages/SignUp";
import { useLocation, useNavigate } from "react-router-dom";
import Message from "./Message";
import Spinner from "./Spinner";
import Modal from "./Modal";

function Users() {
  const { users, deleteUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [visibledId, setVisibledId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  async function handleDeleteUser(id) {
    setIsModalOpen(true);
    setUserIdToDelete(id);
  }

  async function onConfirm() {
    try {
      await deleteUser(userIdToDelete);
      setMsgText("User has been deleted successfully");
      setShowMsg(true);
    } catch (e) {
      setMsgText(e.message);
      setShowMsg(true);
    }
  }

  async function handleEditUser(user) {
    setUserToEdit(user);
    setShowForm(true);
  }

  useEffect(
    function () {
      if (!showMsg) return;
      const timer = setTimeout(function () {
        setShowMsg(false);
      }, 2000);

      return () => clearTimeout(timer);
    },
    [showMsg]
  );

  useEffect(
    function () {
      if (!location?.state?.msg) return;

      setMsgText(location?.state?.msg);
      setShowMsg(true);

      navigate(location.pathname, { state: { msg: "", showMsg: false } });
      const timer = setTimeout(function () {
        setShowMsg(false);
      }, 3000);

      () => clearTimeout(timer);
    },
    [location?.state?.msg, msgText, showMsg]
  );

  return (
    <main className={styles.wholeContainer}>
      <Modal
        mode="delete"
        IsModalOpen={IsModalOpen}
        setIsModalOpen={setIsModalOpen}
        onConfirm={onConfirm}
      />
      <section className={styles.usersContainer}>
        {users.length === 0 && <Spinner />}

        {users.length > 0 && (
          <section className={styles.usersTableWrapper}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    {/*if the current row is already visibled then set it to null to hide that otherwise set the visibledId to current user id that causes to show that*/}
                    <td
                      className={styles.password}
                      onClick={() =>
                        setVisibledId((prev) =>
                          prev === user.id ? null : user.id
                        )
                      }
                    >
                      {visibledId === user.id ? user.password : "#######"}
                      {/* if current userid is equal to visibledId then show current userpassword otherwise show #####*/}
                    </td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        onClick={() => handleEditUser(user)}
                        className={styles.action}
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => handleDeleteUser(user.id)}
                        className={styles.action}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={(e) => {
                setUserToEdit(null);
                setShowForm((prev) => !prev);
              }}
              className={styles.btnAddUser}
            >
              {" "}
              {showForm ? "Close " : "Create user"}
            </button>
          </section>
        )}

        {showForm && (
          <SignUp
            setShowForm={setShowForm}
            userToEdit={userToEdit}
            className={styles.signUp}
            formClass={styles.formClass}
            btnClass={styles.btnClass}
            usedByAdmin={true}
          />
        )}
      </section>
      {showMsg && <Message className={styles.msg} message={msgText} />}
    </main>
  );
}

export default Users;
