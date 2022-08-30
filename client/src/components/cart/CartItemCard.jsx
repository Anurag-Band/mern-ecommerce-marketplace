import React, { useState } from "react";
import { useDispatch } from "react-redux";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  addToCart,
  decreaseCartItemQuantity,
} from "../../features/cart/cartSlice";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(item.quantity);

  const handleAddToCart = () => {
    if (quantity >= item.stock) return;
    const qty = quantity + 1;
    setQuantity(qty);
    dispatch(addToCart(item.itemId._id));
  };

  const handleDecreaseQuantity = () => {
    if (quantity === 1) return;

    const qty = quantity - 1;
    setQuantity(qty);
    dispatch(decreaseCartItemQuantity(item.itemId._id));
  };
  return (
    <div className="flex items-center gap-10 p-5 bg-white shadow-md rounded-sm border-b-2 m-3">
      <div className="w-40 h-40 overflow-hidden rounded-full">
        <img
          src={item.itemId?.photos[0].secure_url}
          alt={item.name}
          className="w-40 h-40 object-cover"
        />
      </div>
      <h3 className="text-md text-slate-500 font-medium line-clamp-2 w-[40%] px-2">
        {item.name}
      </h3>
      <div className="flex items-center gap-3">
        <button type="button" onClick={handleAddToCart}>
          <AddCircleIcon fontSize="medium" className="text-red-500" />
        </button>
        <input
          type="number"
          readOnly
          value={quantity}
          className="w-16 border-slate-400 focus:ring-0 focus:border-slate-400 cursor-default"
        />
        <button
          type="button"
          onClick={handleDecreaseQuantity}
          disabled={quantity === 1}
        >
          <RemoveCircleIcon fontSize="medium" className="text-red-500" />
        </button>
      </div>
      <div>
        <h3 className="font-semibold text-lg">$ {item.price}</h3>
        <p className="text-red-500 underline text-sm">Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
