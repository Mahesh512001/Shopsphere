import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `https://localhost:7272/api/Products/${id}`
        );

        setProduct(response.data);
      } catch (error) {
        console.error(error);
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-xl font-semibold">
          Loading product...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-xl font-semibold text-red-600">
          {error}
        </p>
      </main>
    );
  }

  const imageUrl = product.imageUrl?.startsWith("http")
    ? product.imageUrl
    : `https://localhost:7272/${product.imageUrl}`;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleBuyNow = () => {
    onAddToCart(product);
    navigate("/cart");
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-2 md:p-10">
        <div className="flex min-h-96 items-center justify-center rounded-xl bg-gray-50 p-6">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-96 w-full object-contain"
          />
        </div>

        <div className="flex flex-col justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 w-fit text-blue-600 hover:underline"
          >
            ← Go Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-blue-600">
            {formattedPrice}
          </p>

          {product.description && (
            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>
          )}

          {product.stock > 0 ? (
            <p className="mt-5 font-semibold text-green-600">
              In Stock ({product.stock})
            </p>
          ) : (
            <p className="mt-5 font-semibold text-red-600">
              Out of Stock
            </p>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="flex-1 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Add to Cart
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;