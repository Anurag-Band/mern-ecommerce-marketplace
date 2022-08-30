import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "../../features/cart/cartSlice";
import CartItemCard from "../../components/cart/CartItemCard";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, subTotal } = useSelector((state) => state.cart);

  const handleCheckout = () => {
    navigate("/auth/login?redirect=shipping");
  };

  useEffect(() => {
    dispatch(fetchCartItems())
      .then(unwrapResult)
      .then((obj) => console.log({ cartThen: obj }))
      .catch((obj) => console.log({ cartCatch: obj }));
  }, [dispatch]);

  return (
    <main className="container py-5 xl:py-10 mx-auto min-h-[85vh]">
      <div className="lg:w-4/5 mx-auto flex relative gap-2">
        <div className="flex flex-col w-3/4">
          {cartItems?.map((item) => (
            <CartItemCard key={item._id} item={item} />
          ))}
        </div>
        <div className="w-1/4 flex flex-col gap-5 justify-between p-6 bg-white shadow-lg h-60 mt-3 sticky top-24">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">Sub-Total</h3>
              <p>{cartItems.length} items</p>
            </div>
            <h3 className="py-3 text-2xl font-bold">$ {subTotal}</h3>
          </div>
          <button
            onClick={handleCheckout}
            className="py-2 px-6 rounded-sm w-full text-xl bg-blue-500 text-white font-bold border border-blue-500 hover:bg-blue-400 active:bg-blue-600 active:text-white cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
