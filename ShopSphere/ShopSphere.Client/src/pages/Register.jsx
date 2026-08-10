import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const user = await register({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber || null,
        password: form.password,
        role: form.role,
      });

      if (user.roles.includes("Seller")) {
        navigate("/manage-products", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ?? "Unable to create account."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Create Account
        </h1>

        {error && (
          <p className="mt-5 rounded-lg bg-red-100 p-3 text-center font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="fullName"
              className="font-semibold text-gray-700"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
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
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phoneNumber"
              className="font-semibold text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="role"
              className="font-semibold text-gray-700"
            >
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="Customer">
                Customer — buy products
              </option>

              <option value="Seller">
                Seller — manage own products
              </option>
            </select>
          </div>

          <div>
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
              minLength="8"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="font-semibold text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength="8"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Password must contain uppercase, lowercase, number,
          special character and at least 8 characters.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting
            ? "Creating account..."
            : "Register"}
        </button>

        <p className="mt-5 text-center text-gray-600">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
