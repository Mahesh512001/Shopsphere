import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function Products({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "https://localhost:7272/api/Products"
        );

        setProducts(response.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">
          Loading products...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-xl font-semibold text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Our Products
          </h1>

          <p className="mt-3 text-gray-600">
            Explore our latest product collection.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            No products available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Products;