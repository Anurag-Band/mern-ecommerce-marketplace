import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteReset,
  fetchProductDetails,
  fetchSingleProductReviews,
} from "../../features/product/productSlice";
import { STATUSES } from "../../utils/STATUSES";
import Loader from "../../assets/loader.svg";
import Rating from "@mui/material/Rating";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ProductCarousal from "../../components/product/ProductCarousal";
import ReviewModal from "../../components/review/ReviewModal";
import ReviewCard from "../../components/review/ReviewCard";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    productDetails: product,
    status,
    productReviews,
    isReviewDeleted,
  } = useSelector((state) => state.product);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [id, dispatch]);

  const handleIncreaseQuantity = () => {
    if (quantity >= product.stock) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const handleDecreaseQuantity = () => {
    if (quantity === 1) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  useEffect(() => {
    if (!product) {
      navigate("/products");
    }

    dispatch(fetchSingleProductReviews(id));

    if (isReviewDeleted) {
      dispatch(fetchSingleProductReviews(id));
      dispatch(deleteReset());
    }
  }, [navigate, product, dispatch, id, isReviewDeleted]);

  const reFetchReviews = () => {
    dispatch(fetchSingleProductReviews(id));
  };

  useEffect(() => {
    window.scrollTo({
      top: 42,
      behavior: "smooth",
    });
  }, []);

  if (status === STATUSES.LOADING) {
    return (
      <div className="flex items-center justify-center w-full min-h-[85vh]">
        <img src={Loader} alt="Loading..." className="w-24 h-24" />
      </div>
    );
  }

  return (
    <main className="text-gray-600 overflow-hidden">
      <div className="container py-5 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2">
            {product.photos && <ProductCarousal photos={product.photos} />}
          </div>
          <div className="lg:w-1/2 w-full lg:pl-5 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-xl title-font text-gray-600 tracking-widest">
              {product.brand}
            </h2>
            <h1 className="text-gray-900 text-xl md:text-2xl title-font font-medium mb-2">
              {product.name}
            </h1>
            <h1 className="text-sm text-gray-600 font-medium mb-3">
              Product Id : # {product._id}
            </h1>
            <hr className="my-2 bg-slate-200 p-[0.4px]" />
            <div className="flex items-center space-x-1 mb-2">
              <Rating
                size="medium"
                value={product.ratings}
                readOnly={true}
                precision={0.5}
              />
              <span className="flex items-center text-sm text-slate-600 font-normal">
                ({product.numOfReviews})
              </span>
            </div>
            <div className="flex mt-4 items-center pb-5 border-b-2 border-gray-200 mb-5">
              <div className="flex items-center gap-4">
                <button onClick={handleIncreaseQuantity}>
                  <AddCircleIcon fontSize="large" className="text-red-500" />
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button onClick={handleDecreaseQuantity}>
                  <RemoveCircleIcon fontSize="large" className="text-red-500" />
                </button>
              </div>
            </div>
            <div className="flex mb-5">
              <span className="title-font font-medium text-2xl text-gray-900">
                {`$ ${product.price}`}
              </span>
              <button className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded-3xl">
                Add to Card
              </button>
              <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                <FavoriteIcon />
              </button>
            </div>
            <hr className="my-2 bg-slate-200 p-[0.4px]" />
            <p className="leading-relaxed text-sm lg:text-base">
              <span className="text-xl lg:text-xl font-semibold mr-2">
                Description :
              </span>
              {product.description}
            </p>
            <hr className="my-8 bg-slate-200 p-[0.4px]" />
            <button
              onClick={handleOpen}
              className="flex mx-auto text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded-3xl"
            >
              Submit A Review
            </button>
          </div>
        </div>
        {/* User Review Section */}
        <section className="container px-5 py-5 mx-auto mt-10">
          <div className="lg:w-4/5 mx-auto">
            <h2 className="text-center text-2xl lg:text-4xl font-semibold tracking-widest">
              Reviews
            </h2>
            <hr className="my-4 bg-slate-200 p-[0.4px]" />
            <div className="flex flex-wrap gap-2 md:gap-4 mx-auto">
              {productReviews.length > 0 ? (
                productReviews?.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    productId={product._id}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center min-h-[40vh] w-full">
                  <h2 className="text-lg md:text-2xl font-medium text-slate-400 tracking-widest">
                    Nothing to Show, Be the First One to Review
                  </h2>
                </div>
              )}
            </div>
          </div>
        </section>
        <ReviewModal
          open={open}
          handleClose={handleClose}
          productId={id}
          reFetchReviews={reFetchReviews}
        />
      </div>
    </main>
  );
};

export default ProductDetailsPage;
