import { Link } from "react-router";

function Cart({
  cart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
}) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[600px] items-center justify-center bg-gray-100 px-4">
        <div className="text-center">
          <div className="text-8xl">🛒</div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-600">
            Add some products to continue shopping.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            View Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>

          <button
            type="button"
            onClick={clearCart}
            className="font-semibold text-red-600 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-5">
            {cart.map((item) => {
              const imageUrl = item.imageUrl?.startsWith("http")
                ? item.imageUrl
                : `https://localhost:7272/${item.imageUrl}`;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="h-32 w-full object-contain sm:w-32"
                  />

                  <div className="flex-1">
                    <Link
                      to={`/products/${item.id}`}
                      className="text-xl font-bold text-gray-900 hover:text-blue-600"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 font-semibold text-blue-600">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        className="h-9 w-9 rounded-lg border font-bold hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.stock}
                        className="h-9 w-9 rounded-lg border font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(
                        Number(item.price) * item.quantity
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 font-semibold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="mt-4 flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className="font-semibold text-green-600">
                Free
              </span>
            </div>

            <div className="mt-6 border-t pt-5">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                alert("Checkout functionality will be added next.")
              }
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;