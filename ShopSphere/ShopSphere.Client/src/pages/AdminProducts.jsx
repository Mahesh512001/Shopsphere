import { useCallback, useEffect, useState } from "react";
import api from "../api/api";

const API_URL = "/Products";

const emptyForm = {
  name: "",
  price: "",
  stock: "",
  imageUrl: "",
  description: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `${API_URL}/manage`
      );

      setProducts(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ?? "Unable to load manageable products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl.trim() || null,
      description: form.description.trim() || null,
    };

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingId !== null) {
        await api.put(
          `${API_URL}/${editingId}`,
          payload
        );

        setMessage("Product updated successfully.");
      } else {
        await api.post(API_URL, payload);
        setMessage("Product added successfully.");
      }

      resetForm();
      await fetchProducts();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ?? "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name ?? "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      imageUrl: product.imageUrl ?? "",
      description: product.description ?? "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) {
      return;
    }

    try {
      setDeletingId(product.id);
      setError("");
      setMessage("");

      await api.delete(`${API_URL}/${product.id}`);

      setMessage("Product deleted successfully.");

      if (editingId === product.id) {
        resetForm();
      }

      await fetchProducts();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ?? "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7272/${imageUrl.replace(
          /^\/+/,
          ""
        )}`;
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Manage Products
        </h1>

        <p className="mt-2 text-gray-600">
          Sellers see only their own products. Admin sees all products.
        </p>

        {message && (
          <p className="mt-5 rounded-lg bg-green-100 p-3 font-semibold text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-lg bg-red-100 p-3 font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">
              {editingId === null
                ? "Add Product"
                : "Edit Product"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              {[
                ["name", "Product Name", "text"],
                ["price", "Price", "number"],
                ["stock", "Stock", "number"],
                ["imageUrl", "Image Path", "text"],
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="font-semibold text-gray-700"
                  >
                    {label}
                  </label>

                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    required={
                      name === "name"
                      || name === "price"
                      || name === "stock"
                    }
                    min={
                      name === "price"
                        ? "1"
                        : name === "stock"
                          ? "0"
                        : undefined
                    }
                    step={
                      name === "price" ? "0.01" : undefined
                    }
                    className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="description"
                  className="font-semibold text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {form.imageUrl && (
                <img
                  src={getImageUrl(form.imageUrl)}
                  alt="Preview"
                  className="h-40 w-full rounded-lg bg-gray-50 object-contain"
                />
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-bold text-white disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : editingId === null
                      ? "Add Product"
                      : "Update Product"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border px-4 py-3 font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="overflow-hidden rounded-xl bg-white shadow">
            {loading ? (
              <p className="p-8 text-center">
                Loading products...
              </p>
            ) : products.length === 0 ? (
              <p className="p-8 text-center">
                No manageable products found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-5 py-4">Image</th>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Price</th>
                      <th className="px-5 py-4">Stock</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-t"
                      >
                        <td className="px-5 py-4">
                          {product.imageUrl ? (
                            <img
                              src={getImageUrl(
                                product.imageUrl
                              )}
                              alt={product.name}
                              className="h-16 w-16 object-contain"
                            />
                          ) : (
                            "No image"
                          )}
                        </td>

                        <td className="px-5 py-4 font-semibold">
                          {product.name}
                        </td>

                        <td className="px-5 py-4 text-blue-600">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4">
                          {product.stock}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(product)
                              }
                              className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-white"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(product)
                              }
                              disabled={
                                deletingId === product.id
                              }
                              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
                            >
                              {deletingId === product.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminProducts;
