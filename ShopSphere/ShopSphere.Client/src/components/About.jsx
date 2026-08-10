function About() {
  return (
    <section id="about" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-wider text-blue-600">
            About ShopSphere
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything you need in one place
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            ShopSphere is a full-stack e-commerce application developed using
            React, Tailwind CSS, ASP.NET Core Web API, Entity Framework Core and
            SQL Server.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-6 text-center shadow-sm">
            <div className="text-4xl">🚚</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Fast Delivery
            </h3>
            <p className="mt-2 text-gray-600">
              Reliable delivery service across multiple locations.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-6 text-center shadow-sm">
            <div className="text-4xl">🔒</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Secure Shopping
            </h3>
            <p className="mt-2 text-gray-600">
              A safe and simple shopping experience for every customer.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-6 text-center shadow-sm">
            <div className="text-4xl">⭐</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Quality Products
            </h3>
            <p className="mt-2 text-gray-600">
              Products selected to provide value, quality and satisfaction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;