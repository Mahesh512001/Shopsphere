import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const navigationLinks = (
    <>
      <NavLink to="/" onClick={closeMenu} className={linkClass}>
        Home
      </NavLink>

      <NavLink
        to="/products"
        onClick={closeMenu}
        className={linkClass}
      >
        Products
      </NavLink>

      <NavLink
        to="/about"
        onClick={closeMenu}
        className={linkClass}
      >
        About
      </NavLink>

      {(hasRole("Seller") || hasRole("Admin")) && (
        <NavLink
          to="/manage-products"
          onClick={closeMenu}
          className={linkClass}
        >
          Manage Products
        </NavLink>
      )}

      {hasRole("Admin") && (
        <NavLink
          to="/admin/users"
          onClick={closeMenu}
          className={linkClass}
        >
          Users
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold text-blue-600"
        >
          ShopSphere
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navigationLinks}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <span className="max-w-40 truncate font-semibold text-gray-700">
                {user.fullName}
              </span>

              {hasRole("Customer") && (
                <Link
                  to="/cart"
                  className="relative rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border px-4 py-2 font-semibold text-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border px-4 py-2 font-semibold"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="rounded-lg p-2 text-2xl lg:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t bg-white px-4 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navigationLinks}

            {user ? (
              <>
                <p className="font-semibold text-gray-700">
                  {user.fullName}
                </p>

                {hasRole("Customer") && (
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white"
                  >
                    Cart ({cartCount})
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border px-4 py-2 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg border px-4 py-2 text-center font-semibold"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
