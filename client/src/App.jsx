import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/product/LandingPage";
import ProductsPage from "./pages/product/ProductsPage";
import ProductDetailsPage from "./pages/product/ProductDetailsPage";
import LogInPage from "./pages/user/LogInPage";
import SignUpPage from "./pages/user/SignUpPage";
import ProfilePage from "./pages/user/ProfilePage";
import { loadUser } from "./features/auth/authSlice";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdatePassword from "./pages/user/UpdatePassword";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import CartPage from "./pages/product/CartPage";
import WebLayout from "./pages/layout/WebLayout";
import AppLayout from "./pages/layout/AppLayout";
import ShippingInfoPage from "./pages/orderCheckout/ShippingInfoPage";
import ConfirmOrderPage from "./pages/orderCheckout/ConfirmOrderPage";
import PaymentDetailsPage from "./pages/orderCheckout/PaymentDetailsPage";
import axios from "axios";
import { store } from "./app/store";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentSuccessPage from "./pages/orderCheckout/PaymentSuccessPage";
import MyOrdersPage from "./pages/orderCheckout/MyOrdersPage";
import OrderDetailsPage from "./pages/orderCheckout/OrderDetailsPage";

const App = () => {
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripekey");

    setStripeApiKey(data.stripekey);
  }

  useEffect(() => {
    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  return (
    <main className="bg-slate-50 font-secondary relative">
      <Routes>
        {/* product routes */}
        <Route element={<WebLayout />}>
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
          </Route>
        </Route>

        <Route element={<AppLayout />}>
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* cart route */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shipping" element={<ShippingInfoPage />} />
            <Route path="/myorders" element={<MyOrdersPage />} />
            {stripeApiKey && (
              <Route
                path="/process/payment"
                element={
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <PaymentDetailsPage />
                  </Elements>
                }
              />
            )}
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/order/confirm" element={<ConfirmOrderPage />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </main>
  );
};

export default App;
