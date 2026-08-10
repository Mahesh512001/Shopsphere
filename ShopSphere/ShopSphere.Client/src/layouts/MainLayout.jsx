// src/layouts/MainLayout.jsx

import { Outlet } from "react-router";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ cartCount }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <Navbar cartCount={cartCount} />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;