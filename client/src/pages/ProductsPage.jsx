import React, { useEffect, useState } from "react";
import MetaData from "../components/layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../features/product/productSlice";
import ProductCard from "../components/product/ProductCard";
import { Pagination, Slider } from "@mui/material";
import { useParams } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import { capitaliseFirstLetter } from "../utils/capitaliseFirstLetter";

const categories = ["electronics", "books", "fashion"];

const ProductsPage = () => {
  const dispatch = useDispatch();
  const {
    products,
    resultPerPage,
    totalProductsCount,
    filteredProductsCount,
    errorMessage,
  } = useSelector((state) => state.product);
  const { search } = useParams();

  const [price, setPrice] = useState([0, 2500]);
  const [ratings, setRatings] = useState(0);
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [toggleFilter, setToggleFilter] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts(search, currentPage, price, category, ratings));
  }, [dispatch, search, currentPage, price, category, ratings]);

  return (
    <div className="min-h-screen w-full">
      <MetaData title="Explore Products" />
      <div className="container mx-auto flex relative">
        <div
          className={`${
            toggleFilter ? "block absolute h-full" : "hidden"
          } lg:block w-[16rem] py-5 px-8 m-4 z-10 bg-white border border-slate-300 space-y-3`}
        >
          <h2 className="text-2xl font-bold font-primary text-slate-600">
            Filters
          </h2>
          <hr />
          <div>
            <h3 className="text-xl font-medium text-slate-600 my-1">Price</h3>
            <Slider
              size="small"
              sx={{ width: "11rem" }}
              getAriaLabel={() => "Price Filter Slider"}
              value={price}
              onChange={(event, newValue) => setPrice(newValue)}
              valueLabelDisplay="auto"
              disableSwap
              step={500}
              marks
              min={0}
              max={5000}
            />
            <hr />
            <h3 className="text-xl font-medium text-slate-600 my-2">
              Categories
            </h3>
            <ul className="mb-3">
              {categories.map((category) => (
                <li
                  key={category}
                  className="cursor-pointer text-base mb-1 text-slate-800"
                  onClick={() => setCategory(category)}
                >
                  {capitaliseFirstLetter(category)}
                </li>
              ))}
              <button onClick={() => setCategory("")}>See All</button>
            </ul>
            <hr />

            <h3 className="text-xl font-medium text-slate-600 my-1">Ratings</h3>
            <Slider
              size="small"
              sx={{ width: "11rem" }}
              aria-labelledby="continuous-slider"
              value={ratings}
              onChange={(e, newRating) => setRatings(newRating)}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={5}
            />
            <hr />
          </div>
          <div
            className="min-h-full"
            onClick={() => toggleFilter && setToggleFilter(false)}
          />
        </div>

        {category && (
          <div className="w-full h-10 flex items-center justify-center cursor-pointer absolute">
            <h2 className="flex items-center space-x-2 py-1 px-2 mt-2 text-2xl md:text-3xl text-slate-600">
              {capitaliseFirstLetter(category)}
            </h2>
          </div>
        )}
        <button className="w-full h-10 flex lg:hidden items-center justify-end cursor-pointer absolute">
          <h2
            onClick={() => setToggleFilter((prev) => !prev)}
            className="flex items-center space-x-2 py-1 px-2 mt-3 border-2 rounded-sm bg-blue-50 border-blue-300 active:bg-blue-200"
          >
            <span className="text-lg font-medium text-slate-600">Filters</span>
            <FilterListIcon />
          </h2>
        </button>

        <div className="grid grid-cols-2 px-2 lg:px-8 my-14 sm:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 md:gap-12 xl:gap-14">
          {products &&
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </div>
      <div className="w-full flex justify-center items-center my-7">
        {filteredProductsCount > resultPerPage && (
          <Pagination
            variant="outlined"
            shape="rounded"
            size="large"
            defaultPage={1}
            count={Math.ceil(filteredProductsCount / resultPerPage)}
            showFirstButton
            showLastButton
            onChange={(e, pageValue) => setCurrentPage(pageValue)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
