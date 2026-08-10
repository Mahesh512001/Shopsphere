import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutPage from "./pages/AboutPage";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem("shopsphere-cart");

      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "shopsphere-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock
                ),
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart((previousCart) =>
        previousCart.filter(
          (item) => item.id !== productId
        )
      );

      return;
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                newQuantity,
                item.stock
              ),
            }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.id !== productId
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Routes>
      <Route element={<MainLayout cartCount={cartCount} />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/products"
          element={
            <Products onAddToCart={handleAddToCart} />
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              onAddToCart={handleAddToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <RoleRoute allowedRoles={["Customer"]}>
              <Cart
                cart={cart}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            </RoleRoute>
          }
        />

        <Route
          path="/manage-products"
          element={
            <RoleRoute allowedRoles={["Seller", "Admin"]}>
              <AdminProducts />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["Admin"]}>
              <AdminUsers />
            </RoleRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/access-denied"
          element={<AccessDenied />}
        />

        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
