import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Notification from "./components/layout/Notification";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

function App() {
  return (
    <main className="bg-gray-50 font-secondary relative">
      <Notification />
      <Navigation />

      <Routes>
        <Route path="*" element={<h1>404 - N0T FOUND</h1>} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
      </Routes>

      <Footer />
    </main>
  );
}

export default App;
