import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const user = await login(form);
      const requestedPage = location.state?.from;

      if (requestedPage) {
        navigate(requestedPage, { replace: true });
        return;
      }

      if (user.roles.includes("Admin")) {
        navigate("/admin/users", { replace: true });
      } else if (user.roles.includes("Seller")) {
        navigate("/manage-products", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ?? "Unable to log in."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[650px] items-center justify-center bg-gray-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Login
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Login to your ShopSphere account
        </p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-100 p-3 text-center font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-7">
          <label
            htmlFor="email"
            className="font-semibold text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="password"
            className="font-semibold text-gray-700"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-gray-600">
          New user?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
