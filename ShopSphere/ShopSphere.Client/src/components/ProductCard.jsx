import { Link, useNavigate } from "react-router";

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

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
    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/products/${product.id}`}>
        <div className="h-60 bg-gray-50 p-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h2 className="truncate text-xl font-bold text-gray-800 hover:text-blue-600">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 text-2xl font-semibold text-blue-600">
          {formattedPrice}
        </p>

        {product.stock > 0 ? (
          <p className="mt-2 font-semibold text-green-600">
            In Stock ({product.stock})
          </p>
        ) : (
          <p className="mt-2 font-semibold text-red-600">
            Out of Stock
          </p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="flex-1 rounded-lg bg-yellow-500 px-3 py-2 font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;