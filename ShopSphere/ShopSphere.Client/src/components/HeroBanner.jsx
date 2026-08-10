import { Link } from "react-router";

function HeroBanner() {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
      <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div className="text-white">
          <p className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            New Collection Available
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Discover products made for your lifestyle
          </h1>

          <p className="mt-6 max-w-xl text-lg text-blue-100">
            Shop electronics, fashion and daily essentials at
            affordable prices.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/products"
              className="rounded-lg bg-yellow-500 px-6 py-3 text-center font-bold text-gray-900 transition hover:bg-yellow-400"
            >
              Shop Now
            </Link>

            <Link
              to="/about"
              className="rounded-lg border border-white px-6 py-3 text-center font-bold text-white transition hover:bg-white hover:text-blue-700"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative flex h-80 w-80 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm sm:h-96 sm:w-96">
            <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white shadow-2xl sm:h-72 sm:w-72">
              <span className="text-9xl">🛍️</span>
            </div>

            <div className="absolute left-0 top-8 rounded-xl bg-white px-4 py-3 shadow-lg">
              <p className="font-bold text-gray-900">
                Best Prices
              </p>

              <p className="text-sm text-gray-500">
                Save more today
              </p>
            </div>

            <div className="absolute bottom-6 right-0 rounded-xl bg-white px-4 py-3 shadow-lg">
              <p className="font-bold text-gray-900">
                Fast Delivery
              </p>

              <p className="text-sm text-gray-500">
                Across India
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;