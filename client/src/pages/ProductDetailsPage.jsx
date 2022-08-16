import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductDetails,
  STATUSES,
} from "../features/product/productSlice";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails: product, status } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [id, dispatch]);

  if (status === STATUSES.LOADING) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      {product.photos && (
        <img
          src={product.photos[0].secure_url}
          alt="product"
          className="w-80"
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
