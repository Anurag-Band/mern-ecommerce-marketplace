import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Notification from "./components/layout/Notification";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import { loadUser } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdatePassword from "./pages/UpdatePassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <main className="bg-gray-50 font-secondary relative">
      <Notification />
      <Navigation />

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
        <Route path="/auth/password/forgot" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/password/reset/:token"
          element={<ResetPasswordPage />}
        />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/password/update" element={<UpdatePassword />} />
        </Route>
      </Routes>

      <Footer />
    </main>
  );
};

export default App;
