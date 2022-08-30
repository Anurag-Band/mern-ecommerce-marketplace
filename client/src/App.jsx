import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Notification from "./components/layout/Notification";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/product/LandingPage";
import ProductsPage from "./pages/product/ProductsPage";
import ProductDetailsPage from "./pages/product/ProductDetailsPage";
import LogInPage from "./pages/user/LogInPage";
import SignUpPage from "./pages/user/SignUpPage";
import ProfilePage from "./pages/user/ProfilePage";
import { loadUser } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdatePassword from "./pages/user/UpdatePassword";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import CartPage from "./pages/product/CartPage";
import CheckoutStepsPage from "./pages/order/CheckoutStepsPage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <main className="bg-sky-50 font-secondary relative">
      <Notification />
      <Navigation />
      <main className="min-h-[85vh]">
        <Routes>
          {/* product routes */}
          {/* <Route path="*" element={<h1>404 - N0T FOUND</h1>} /> */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:search" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />

          {/* user routes */}
          <Route path="/auth/login" element={<LogInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route
            path="/auth/password/forgot"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/auth/password/reset/:token"
            element={<ResetPasswordPage />}
          />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<ProfilePage />} />
            <Route
              path="/account/password/update"
              element={<UpdatePassword />}
            />
            {/* cart route */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shipping" element={<CheckoutStepsPage />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </main>
  );
};

export default App;
