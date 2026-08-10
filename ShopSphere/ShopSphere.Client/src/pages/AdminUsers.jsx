import { useEffect, useState } from "react";
import api from "../api/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ?? "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (user) => {
    const reason = window.prompt(
      `Why do you want to block ${user.fullName}?`
    );

    if (!reason?.trim()) {
      return;
    }

    try {
      setWorkingId(user.id);
      setError("");
      setMessage("");

      await api.put(`/admin/users/${user.id}/block`, {
        reason: reason.trim(),
      });

      setMessage("User blocked successfully.");
      await fetchUsers();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ?? "Unable to block user."
      );
    } finally {
      setWorkingId(null);
    }
  };

  const unblockUser = async (user) => {
    try {
      setWorkingId(user.id);
      setError("");
      setMessage("");

      await api.put(`/admin/users/${user.id}/unblock`);

      setMessage("User unblocked successfully.");
      await fetchUsers();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ?? "Unable to unblock user."
      );
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>

            <p className="mt-2 text-gray-600">
              Block or unblock customer and seller accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            className="rounded-lg border bg-white px-4 py-2 font-semibold"
          >
            Refresh
          </button>
        </div>

        {message && (
          <p className="mb-5 rounded-lg bg-green-100 p-3 font-semibold text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-5 rounded-lg bg-red-100 p-3 font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-xl bg-white shadow">
          {loading ? (
            <p className="p-8 text-center">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const isAdmin =
                      user.roles.includes("Admin");

                    return (
                      <tr key={user.id} className="border-t">
                        <td className="px-5 py-4 font-semibold">
                          {user.fullName}
                        </td>

                        <td className="px-5 py-4">
                          {user.email}
                        </td>

                        <td className="px-5 py-4">
                          {user.roles.join(", ")}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={
                              user.isActive
                                ? "font-semibold text-green-600"
                                : "font-semibold text-red-600"
                            }
                          >
                            {user.isActive
                              ? "Active"
                              : "Blocked"}
                          </span>
                        </td>

                        <td className="max-w-xs px-5 py-4 text-gray-600">
                          {user.blockReason || "—"}
                        </td>

                        <td className="px-5 py-4">
                          {isAdmin ? (
                            <span className="text-gray-400">
                              Protected admin
                            </span>
                          ) : user.isActive ? (
                            <button
                              type="button"
                              onClick={() => blockUser(user)}
                              disabled={workingId === user.id}
                              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => unblockUser(user)}
                              disabled={workingId === user.id}
                              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
                            >
                              Unblock
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminUsers;
