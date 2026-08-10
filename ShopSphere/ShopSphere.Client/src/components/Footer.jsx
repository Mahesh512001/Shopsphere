function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            ShopSphere
          </h2>

          <p className="mt-4 leading-7 text-gray-400">
            A modern full-stack e-commerce application built with React and
            ASP.NET Core.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">
            Quick Links
          </h3>

          <div className="mt-4 flex flex-col gap-3">
            <a href="#home" className="hover:text-white">
              Home
            </a>

            <a href="#products" className="hover:text-white">
              Products
            </a>

            <a href="#about" className="hover:text-white">
              About
            </a>

            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">
            Customer Support
          </h3>

          <div className="mt-4 flex flex-col gap-3">
            <a href="#help" className="hover:text-white">
              Help Centre
            </a>

            <a href="#shipping" className="hover:text-white">
              Shipping Information
            </a>

            <a href="#returns" className="hover:text-white">
              Returns and Refunds
            </a>

            <a href="#privacy" className="hover:text-white">
              Privacy Policy
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">
            Contact
          </h3>

          <div className="mt-4 space-y-3 text-gray-400">
            <p>Email: support@shopsphere.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: India</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-5 text-center text-sm text-gray-500">
        © {currentYear} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;