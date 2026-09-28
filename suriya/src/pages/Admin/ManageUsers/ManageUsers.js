import React, { useEffect, useState } from "react";
import "./ManageUsers.css";

import {
  getAllUsers,
  deleteUser,
} from "../../../Services/userService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers();

      console.log("Users from backend:", data);

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Load Users Error:",
        error
      );

      alert("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(id);

      alert(
        "User deleted successfully!"
      );

      await loadUsers();

    } catch (error) {
      console.error(
        "Delete User Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unable to delete user.";

      alert(message);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="manage-users-page">

        <div className="manage-users-loading">

          <h3>
            Loading Users...
          </h3>

          <p>
            Please wait while users
            are loaded.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="manage-users-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="manage-users-header">

        <div>

          <h1>
            Manage Users
          </h1>

          <p>
            View and manage registered users
          </p>

        </div>

        <div className="users-count">

          {users.length} Users

        </div>

      </div>


      {/* ======================================
          USERS LIST
      ====================================== */}

      {users.length === 0 ? (

        <div className="no-users">

          <h3>
            No Users Found
          </h3>

          <p>
            Registered users will appear
            here.
          </p>

        </div>

      ) : (

        <div className="users-table-container">

          <table className="users-table">

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Address
                </th>

                <th>
                  Role
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {users.map((user) => (

                <tr key={user.id}>

                  {/* ID */}

                  <td>
                    #{user.id}
                  </td>


                  {/* NAME */}

                  <td>

                    <strong>
                      {user.name ||
                        "No Name"}
                    </strong>

                  </td>


                  {/* EMAIL */}

                  <td>

                    {user.email ||
                      "No Email"}

                  </td>


                  {/* PHONE */}

                  <td>

                    {user.phone ||
                      "No Phone"}

                  </td>


                  {/* ADDRESS */}

                  <td>

                    {user.address ||
                      "No Address"}

                  </td>


                  {/* ROLE */}

                  <td>

                    <span
                      className={
                        user.role ===
                        "ADMIN"
                          ? "admin-role"
                          : "user-role"
                      }
                    >
                      {user.role ||
                        "USER"}
                    </span>

                  </td>


                  {/* ACTION */}

                  <td>

                    <button
                      type="button"
                      className="delete-user-btn"
                      onClick={() =>
                        handleDelete(
                          user.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default ManageUsers;