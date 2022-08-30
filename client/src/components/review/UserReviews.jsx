import React from "react";
import { useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";

const UserReviews = ({ productId }) => {
  const productReviews = useSelector((state) => state.product.productReviews);

  return (
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
                productId={productId}
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
  );
};

export default UserReviews;
